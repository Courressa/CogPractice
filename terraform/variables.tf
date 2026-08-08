variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "student-courressamalcolm"
}

variable "lambda_role_arn" {
  description = "Shared Lambda execution role ARN"
  type        = string
  default     = "arn:aws:iam::279249498881:role/quicklabs-fullstack-shared-lambda-exec"
}

variable "mongodb_uri" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret"
  type        = string
  sensitive   = true
}