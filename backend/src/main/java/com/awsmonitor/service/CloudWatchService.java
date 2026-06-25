package com.awsmonitor.service;

import com.awsmonitor.model.MetricData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cloudwatch.CloudWatchClient;
import software.amazon.awssdk.services.cloudwatch.model.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CloudWatchService {

    private final CloudWatchClient cloudWatchClient;

    public MetricData getCpuUtilization(String instanceId) {
        return getMetric(instanceId, "CPUUtilization", "Percent");
    }

    public MetricData getNetworkIn(String instanceId) {
        return getMetric(instanceId, "NetworkIn", "Bytes");
    }

    public MetricData getNetworkOut(String instanceId) {
        return getMetric(instanceId, "NetworkOut", "Bytes");
    }

    public MetricData getDiskReadOps(String instanceId) {
        return getMetric(instanceId, "DiskReadOps", "Count");
    }

    private MetricData getMetric(String instanceId, String metricName, String unit) {
        GetMetricStatisticsRequest request = GetMetricStatisticsRequest.builder()
            .namespace("AWS/EC2")
            .metricName(metricName)
            .dimensions(Dimension.builder()
                .name("InstanceId")
                .value(instanceId)
                .build())
            .startTime(Instant.now().minusSeconds(3600)) // last 1 hour
            .endTime(Instant.now())
            .period(300) // 5-minute intervals
            .statistics(Statistic.AVERAGE)
            .unit(StandardUnit.fromValue(unit))
            .build();

        GetMetricStatisticsResponse response = cloudWatchClient.getMetricStatistics(request);

        List<MetricData.DataPoint> dataPoints = response.datapoints().stream()
            .sorted((a, b) -> a.timestamp().compareTo(b.timestamp()))
            .map(dp -> MetricData.DataPoint.builder()
                .timestamp(dp.timestamp().toString())
                .value(dp.average())
                .build())
            .collect(Collectors.toList());

        return MetricData.builder()
            .instanceId(instanceId)
            .metricName(metricName)
            .unit(unit)
            .dataPoints(dataPoints)
            .build();
    }
}
