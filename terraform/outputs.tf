output "RESOURCE_s3_bucket_images" {
  value = aws_s3_bucket.images.id
}

output "RESOURCE_s3_bucket_images_domain_name" {
  value = aws_s3_bucket.images.bucket_domain_name
}

output "RESOURCE_aws_vpc_ignite_vpc" {
  value = aws_vpc.ignite_vpc.id
}

output "RESOURCE_aws_subnet_ignite_public_subnet" {
  value = aws_subnet.ignite_public_subnet.id
}

output "RESOURCE_aws_internet_gateway_ignite_igw" {
  value = aws_internet_gateway.ignite_igw.id
}

output "RESOURCE_aws_route_table_ignite_public_rt" {
  value = aws_route_table.ignite_public_rt.id
}

output "RESOURCE_aws_route_default_route" {
  value = aws_route.default_route.id
}

output "RESOURCE_aws_route_table_association_ignite_public_rt_association" {
  value = aws_route_table_association.ignite_public_rt_association.id
}

output "RESOURCE_aws_security_group_ignite_sg" {
  value = aws_security_group.ignite_sg.id
}

# resource "aws_instance" "ignite_rentx" {
output "RESOURCE_aws_instance_ignite_rentx" {
  value = aws_instance.ignite_rentx.id
}
