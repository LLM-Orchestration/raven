{
  description = "A third test tool for Raven MVP with description";

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
        packages.default = pkgs.writeShellApplication {
          name = "raven-test-tool-3";
          runtimeInputs = [ pkgs.bun ];
          text = ''
            bun run ${./tool.ts} "$@"
          '';
        };
      });
}
