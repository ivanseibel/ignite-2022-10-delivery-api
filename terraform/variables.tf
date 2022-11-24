variable "region" {
  description = "value for the region"
  type        = string
  default     = "eu-west-1"
}

variable "profile" {
  description = "value for the profile"
  type        = string
  default     = "tfpersonal"
}

variable "instance_type" {
  type        = string
  description = "The instance power"
  default     = "t2.micro"
}