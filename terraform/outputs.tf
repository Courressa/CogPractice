output "api_url" {
  value = "${aws_api_gateway_deployment.api.invoke_url}"
}

output "lambda_function_name" {
  value = aws_lambda_function.api.function_name
}