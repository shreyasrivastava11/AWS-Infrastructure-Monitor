package com.awsmonitor.service;

import com.awsmonitor.model.EC2InstanceInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.ec2.model.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EC2Service {

    private final Ec2Client ec2Client;

    public List<EC2InstanceInfo> getAllInstances() {
        DescribeInstancesResponse response = ec2Client.describeInstances();

        return response.reservations().stream()
            .flatMap(r -> r.instances().stream())
            .map(this::mapToInstanceInfo)
            .collect(Collectors.toList());
    }

    public EC2InstanceInfo getInstanceById(String instanceId) {
        DescribeInstancesRequest request = DescribeInstancesRequest.builder()
            .instanceIds(instanceId)
            .build();
        DescribeInstancesResponse response = ec2Client.describeInstances(request);

        return response.reservations().stream()
            .flatMap(r -> r.instances().stream())
            .map(this::mapToInstanceInfo)
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Instance not found: " + instanceId));
    }

    public String stopInstance(String instanceId) {
        StopInstancesRequest request = StopInstancesRequest.builder()
            .instanceIds(instanceId)
            .build();
        ec2Client.stopInstances(request);
        return "Stop signal sent to instance: " + instanceId;
    }

    public String startInstance(String instanceId) {
        StartInstancesRequest request = StartInstancesRequest.builder()
            .instanceIds(instanceId)
            .build();
        ec2Client.startInstances(request);
        return "Start signal sent to instance: " + instanceId;
    }

    private EC2InstanceInfo mapToInstanceInfo(Instance instance) {
        String name = instance.tags().stream()
            .filter(t -> t.key().equals("Name"))
            .map(Tag::value)
            .findFirst()
            .orElse("(no name)");

        return EC2InstanceInfo.builder()
            .instanceId(instance.instanceId())
            .instanceType(instance.instanceTypeAsString())
            .state(instance.state().nameAsString())
            .publicIp(instance.publicIpAddress())
            .privateIp(instance.privateIpAddress())
            .availabilityZone(instance.placement().availabilityZone())
            .platform(instance.platformAsString())
            .launchTime(instance.launchTime() != null ? instance.launchTime().toString() : "N/A")
            .name(name)
            .build();
    }
}
