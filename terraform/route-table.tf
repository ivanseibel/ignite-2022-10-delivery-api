resource "aws_route_table" "ignite_public_rt" {
  vpc_id = aws_vpc.ignite_vpc.id
}

resource "aws_route" "default_route" {
  route_table_id         = aws_route_table.ignite_public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.ignite_igw.id
}

resource "aws_route_table_association" "ignite_public_rt_association" {
  subnet_id      = aws_subnet.ignite_public_subnet.id
  route_table_id = aws_route_table.ignite_public_rt.id
}