variable "location" {
  description = "The Azure Region (Allowed by your Policy)"
  default     = "centralindia" 
}

variable "resource_group_name" {
  description = "A fresh name to avoid naming locks"
  default     = "rg-healthpulse-india-final"
}

variable "vm_size" {
  description = "Using the v2 SKU which your quota shows is available"
  default     = "Standard_B2s_v2" # The 'v2' is the magic fix here!
}