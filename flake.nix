{
  description = "Raven - Tool building for Agentic LLMs";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            bun
            gh
            git
            nix
            nodejs_22
          ];

          shellHook = ''
            echo ""
            echo "  Welcome to the Raven development environment!"
            echo "  --------------------------------------------"
            echo "  Tools available:"
            echo "    - Bun:    $(bun --version)"
            echo "    - GH CLI: $(gh --version | head -n 1)"
            echo "    - Git:    $(git --version)"
            echo "    - Nix:    $(nix --version)"
            echo "    - Node:   $(node --version)"
            echo ""
            echo "  To get started:"
            echo "    1. Run 'bun install' to install dependencies."
            echo "    2. Run 'bun link' to make 'raven' available globally in this shell."
            echo "    3. Use 'raven --help' to see available commands."
            echo ""
          '';
        };
      });
}
