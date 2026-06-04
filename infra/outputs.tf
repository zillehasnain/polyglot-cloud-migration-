output "public_ip_address" {
  value = azurerm_linux_virtual_machine.vm.public_ip_address
}

output "dashboard_url" {
  value = "http://${azurerm_linux_virtual_machine.vm.public_ip_address}:3000"
}