package com.awsmonitor.controller;

import com.awsmonitor.model.MetricData;
import com.awsmonitor.service.CloudWatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class MetricsController {

    private final CloudWatchService cloudWatchService;

    // GET CPU utilization for an instance (last 1 hour)
    @GetMapping("/{instanceId}/cpu")
    public ResponseEntity<MetricData> getCpuUtilization(@PathVariable String instanceId) {
        return ResponseEntity.ok(cloudWatchService.getCpuUtilization(instanceId));
    }

    // GET Network In
    @GetMapping("/{instanceId}/network-in")
    public ResponseEntity<MetricData> getNetworkIn(@PathVariable String instanceId) {
        return ResponseEntity.ok(cloudWatchService.getNetworkIn(instanceId));
    }

    // GET Network Out
    @GetMapping("/{instanceId}/network-out")
    public ResponseEntity<MetricData> getNetworkOut(@PathVariable String instanceId) {
        return ResponseEntity.ok(cloudWatchService.getNetworkOut(instanceId));
    }

    // GET Disk Read Ops
    @GetMapping("/{instanceId}/disk-read")
    public ResponseEntity<MetricData> getDiskReadOps(@PathVariable String instanceId) {
        return ResponseEntity.ok(cloudWatchService.getDiskReadOps(instanceId));
    }
}
