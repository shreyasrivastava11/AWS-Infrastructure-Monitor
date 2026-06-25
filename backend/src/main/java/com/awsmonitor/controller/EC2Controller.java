package com.awsmonitor.controller;

import com.awsmonitor.model.EC2InstanceInfo;
import com.awsmonitor.service.EC2Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ec2")
@RequiredArgsConstructor
public class EC2Controller {

    private final EC2Service ec2Service;

    // GET all EC2 instances
    @GetMapping("/instances")
    public ResponseEntity<List<EC2InstanceInfo>> getAllInstances() {
        return ResponseEntity.ok(ec2Service.getAllInstances());
    }

    // GET single EC2 instance by ID
    @GetMapping("/instances/{instanceId}")
    public ResponseEntity<EC2InstanceInfo> getInstance(@PathVariable String instanceId) {
        return ResponseEntity.ok(ec2Service.getInstanceById(instanceId));
    }

    // POST start an instance
    @PostMapping("/instances/{instanceId}/start")
    public ResponseEntity<String> startInstance(@PathVariable String instanceId) {
        return ResponseEntity.ok(ec2Service.startInstance(instanceId));
    }

    // POST stop an instance
    @PostMapping("/instances/{instanceId}/stop")
    public ResponseEntity<String> stopInstance(@PathVariable String instanceId) {
        return ResponseEntity.ok(ec2Service.stopInstance(instanceId));
    }
}
