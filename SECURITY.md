# Security Policy

## Supported Versions

UltraLink is currently in early development. We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of UltraLink seriously. If you believe you've found a security vulnerability, please follow these steps:

1. **Do not disclose the vulnerability publicly**
2. **Email us directly at security@ultralink.dev** with:
   - A description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any ideas for mitigation
3. **Allow time for response and resolution**
   - We aim to acknowledge receipt within 24 hours
   - We'll provide an estimated timeline for a fix
   - We'll keep you updated on our progress

## Security Measures

UltraLink implements several security measures by default:

### Input Validation

- All inputs are validated before processing
- Schema validation for entity and relationship structures
- Type checking to prevent unexpected behavior

### Dependency Security

- Regular automated vulnerability scanning
- Dependency updates on a regular schedule
- Minimal dependency footprint to reduce attack surface

### Runtime Protection

- No arbitrary code execution from data files
- Restricted file system access in exported formats
- Content Security Policy (CSP) in HTML Website exports

### Data Privacy

- No automatic data collection or telemetry
- All data remains local by default
- Optional encryption for sensitive data in Full Blob exports

## Best Practices

When using UltraLink in your projects, consider these security best practices:

1. **Keep UltraLink updated** to the latest version
2. **Validate and sanitize** all data before adding to UltraLink
3. **Use content restrictions** when exporting to HTML Website
4. **Consider encryption** for Full Blob exports containing sensitive data
5. **Apply access controls** when serving UltraLink exports over networks

## Security Roadmap

Future security enhancements planned for UltraLink:

- End-to-end encryption for collaborative features
- Digital signatures for data integrity verification 
- Role-based access control for multi-user environments
- Audit logging for security-relevant operations
- Advanced sandboxing for plugin execution 