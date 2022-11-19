data "aws_caller_identity" "current" {}

resource "random_pet" "bucket_name" {
  length    = 4
  separator = "-"
  prefix    = data.aws_caller_identity.current.account_id
}