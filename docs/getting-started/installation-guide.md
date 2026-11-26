# Install from source

This checkout's data-focused verification uses Node.js 22.23.5.
Install Node and npm with your usual version manager. From a terminal:

```bash
git clone https://github.com/docxology/ultralink-docx.git
cd ultralink-docx
node --version
npm ci
```

The complete development environment includes the locked native
`canvas` dependency. When npm builds it from source, install the
platform's C/C++ toolchain, Python, pkg-config, Cairo and Pango
development packages. The selected canvas features may also use
JPEG, GIF and SVG libraries. [Canvas installation guide](https://github.com/Automattic/node-canvas#compiling)

For the portable JSON, GraphML and CSV checks in a checkout without
graphics build libraries, install the same lock with
`npm ci --ignore-scripts`. Use this setup for the [first graph](quick-start.md)
and the [scoped data tests](../contributing/development-setup.md).
Native graphics and the complete visualization suite require the full setup.
