resource "aws_subnet" "ignite_public_subnet" {
  vpc_id                  = aws_vpc.ignite_vpc.id
  cidr_block              = "10.123.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "eu-west-1a"
}