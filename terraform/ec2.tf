data "aws_ami" "ubuntu" {
  owners      = ["amazon"]
  most_recent = true
  name_regex  = "Ubuntu"
}

resource "aws_key_pair" "ignite_auth" {
  key_name   = "ignite_auth"
  public_key = file("~/.ssh/aws_ignite_key.pub")
}

resource "aws_instance" "ignite_rentx" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  user_data = file("user-data.sh")

  key_name = aws_key_pair.ignite_auth.key_name
  vpc_security_group_ids = [
    aws_security_group.ignite_sg.id,
  ]
  subnet_id = aws_subnet.ignite_public_subnet.id
}
