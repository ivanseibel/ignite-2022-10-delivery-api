resource "aws_internet_gateway" "ignite_igw" {
  vpc_id = aws_vpc.ignite_vpc.id
}