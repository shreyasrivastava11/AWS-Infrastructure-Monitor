package com.awsmonitor.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class S3BucketInfo {
    private String bucketName;
    private String creationDate;
    private long objectCount;
    private String totalSize;
    private String region;
}
