import axios from 'axios';

const BASE_URL = '/api';

// EC2 APIs
export const fetchInstances = () => axios.get(`${BASE_URL}/ec2/instances`);
export const fetchInstance = (id) => axios.get(`${BASE_URL}/ec2/instances/${id}`);
export const startInstance = (id) => axios.post(`${BASE_URL}/ec2/instances/${id}/start`);
export const stopInstance = (id) => axios.post(`${BASE_URL}/ec2/instances/${id}/stop`);

// S3 APIs
export const fetchBuckets = () => axios.get(`${BASE_URL}/s3/buckets`);
export const fetchBucketObjects = (name) => axios.get(`${BASE_URL}/s3/buckets/${name}/objects`);

// CloudWatch APIs
export const fetchCpuMetrics = (id) => axios.get(`${BASE_URL}/metrics/${id}/cpu`);
export const fetchNetworkIn = (id) => axios.get(`${BASE_URL}/metrics/${id}/network-in`);
export const fetchNetworkOut = (id) => axios.get(`${BASE_URL}/metrics/${id}/network-out`);
