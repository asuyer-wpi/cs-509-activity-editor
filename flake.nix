{
  description = "JavaScript/TypeScript web-development shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_22

            # Language servers 
            typescript-language-server
            vscode-langservers-extracted
            tailwindcss-language-server

            # Type checker 
            typescript

            # Linters and formatters
            eslint
            prettier

            # Debugger 
            vscode-js-debug
          ];

          shellHook = ''
            # Put project-local binaries (vite, tsc, eslint...) on PATH.
            export PATH="$PWD/node_modules/.bin:$PATH"
          '';
        };

        formatter = pkgs.nixfmt;
      }
    );
}
