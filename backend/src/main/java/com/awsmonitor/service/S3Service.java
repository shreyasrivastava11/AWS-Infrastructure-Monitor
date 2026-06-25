package com.awsmonitor.service;

import com.awsmonitor.model.S3BucketInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    public List<S3BucketInfo> getAllBuckets() {
        ListBucketsResponse response = s3Client.listBuckets();

        return response.buckets().stream()
            .map(this::mapToBucketInfo)
            .collect(Collectors.toList());
    }

    public List<String> getObjectKeys(String bucketName) {
        ListObjectsV2Response response = s3Client.listObjectsV2(
            ListObjectsV2Request.builder().bucket(bucketName).build()
        );
        return response.contents().stream()
            .map(S3Object::key)
            .collect(Collectors.toList());
    }

    public long getObjectCount(String bucketName) {
        ListObjectsV2Response response = s3Client.listObjectsV2(
            ListObjectsV2Request.builder().bucket(bucketName).build()
        );
        return response.keyCount();
    }

    private S3BucketInfo mapToBucketInfo(Bucket bucket) {
        long objectCount = 0;
        try {
            objectCount = getObjectCount(bucket.name());
        } catch (Exception ignored) {}

        return S3BucketInfo.builder()
            .bucketName(bucket.name())
            .creationDate(bucket.creationDate() != null ? bucket.creationDate().toString() : "N/A")
            .objectCount(objectCount)
            .region("us-east-1")
            .build();
    }
}
