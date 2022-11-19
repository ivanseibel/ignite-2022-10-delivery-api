terraform {
  required_version = "1.3.2"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.34.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "3.4.3"
    }
  }
}

provider "aws" {
  region  = var.region
  profile = var.profile

  default_tags {
    tags = local.common_tags
  }

}