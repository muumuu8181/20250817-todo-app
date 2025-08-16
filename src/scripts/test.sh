#!/bin/bash

echo "🧪 UI Test Runner Script"
echo "========================"

# Default values
TARGET_FILE="examples/simple-button-app.html"
MODE="basic"
VERBOSE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--target)
            TARGET_FILE="$2"
            shift 2
            ;;
        -a|--auto)
            MODE="auto"
            shift
            ;;
        -b|--bootstrap)
            MODE="bootstrap"
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -t, --target FILE    Target HTML file (default: examples/simple-button-app.html)"
            echo "  -a, --auto           Auto-detect buttons"
            echo "  -b, --bootstrap      Bootstrap mode"
            echo "  -v, --verbose        Verbose output"
            echo "  -h, --help           Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "📂 Target file: $TARGET_FILE"
echo "🔧 Mode: $MODE"

# Build command
CMD="node tools/testing/ui-test-runner.js -t $TARGET_FILE"

case $MODE in
    auto)
        CMD="$CMD --auto-detect"
        ;;
    bootstrap)
        CMD="$CMD --selector-pattern '.btn-' --max-buttons 10"
        ;;
esac

if [ "$VERBOSE" = true ]; then
    CMD="$CMD --verbose"
fi

echo "🚀 Running: $CMD"
echo ""

# Execute test
eval $CMD

echo ""
echo "✅ Test execution complete"