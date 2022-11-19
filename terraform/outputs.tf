output "RESOURCE_s3_bucket_images" {
  value = aws_s3_bucket.images.id
}

output "RESOURCE_s3_bucket_images_domain_name" {
  value = aws_s3_bucket.images.bucket_domain_name
} 