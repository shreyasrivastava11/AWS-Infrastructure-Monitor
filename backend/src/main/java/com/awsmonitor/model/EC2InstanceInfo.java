package com.awsmonitor.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EC2InstanceInfo {
    private String instanceId;
    private String instanceType;
    private String state;
    private String publicIp;
    private String privateIp;
    private String availabilityZone;
    private String platform;
    private String launchTime;
    private String name;
}
