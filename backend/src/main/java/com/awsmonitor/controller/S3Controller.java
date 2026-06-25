package com.awsmonitor.controller;

import com.awsmonitor.model.S3BucketInfo;
import com.awsmonitor.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    // GET all S3 buckets
    @GetMapping("/buckets")
    public ResponseEntity<List<S3BucketInfo>> getAllBuckets() {
        return ResponseEntity.ok(s3Service.getAllBuckets());
    }

    // GET objects in a specific bucket
    @GetMapping("/buckets/{bucketName}/objects")
    public ResponseEntity<List<String>> getBucketObjects(@PathVariable String bucketName) {
        return ResponseEntity.ok(s3Service.getObjectKeys(bucketName));
    }
}
