@echo off & powershell -Command "(Invoke-RestMethod -Uri 'http://localhost:3000/api/chat' -Method Post -ContentType 'application/json' -Body '{\"message\":\"%~1\"}').reply" 
