#!/bin/bash

echo "🚀 Project Template Setup Script"
echo "================================="

# Node.js version check
echo "📋 Checking Node.js version..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js detected: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 14+ first."
    exit 1
fi

# Python version check
echo "📋 Checking Python version..."
if command -v python3 >/dev/null 2>&1; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python detected: $PYTHON_VERSION"
elif command -v python >/dev/null 2>&1; then
    PYTHON_VERSION=$(python --version)
    echo "✅ Python detected: $PYTHON_VERSION"
else
    echo "❌ Python not found. Please install Python 3.7+ first."
    exit 1
fi

# Create test results directory
echo "📁 Creating test results directory..."
mkdir -p test-results
echo "✅ test-results directory created"

# Create data storage directory
echo "📁 Creating data storage directory..."
mkdir -p data
mkdir -p data/exports
mkdir -p data/.backups
echo "✅ data storage directories created"

# Setup Python virtual environment (optional)
if [ "$1" = "--python-venv" ]; then
    echo "🐍 Setting up Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    echo "✅ Python virtual environment setup complete"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🧪 Available test commands:"
echo "  npm run test:ui          - Basic UI test"
echo "  npm run test:ui-auto     - Auto-detect buttons"
echo "  npm run test:ui-verbose  - Verbose output"
echo "  npm run test:bootstrap   - Bootstrap apps"
echo "  npm run test:storage     - Data storage tests"
echo "  npm run storage:demo     - Data storage demo"
echo "  npm run help             - Show help"
echo ""