#!/bin/bash
# Brand Hub — @luizhenriquexpro
# Servidor local para acessar o ecosistema da marca

PORT=${1:-8080}
DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "  ============================================"
echo "  BRAND HUB — @luizhenriquexpro"
echo "  Arquiteto de Operacoes Inteligentes"
echo "  ============================================"
echo ""
echo "  Acessar: http://localhost:$PORT"
echo "  Parar:   Ctrl+C"
echo ""

cd "$DIR"
python3 -m http.server "$PORT"
