import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "src/index.js", // Replace 'src/index.js' with the entry point of your library
  output: [
    {
      format: "esm",
      dir: "dist/esm",
      preserveModules: true,
    },
    {
      file: "dist/library.cjs.js",
      format: "cjs",
    
    },
  ],
  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),
    commonjs(), // Convert CommonJS modules to ES6
    babel({
      exclude: "node_modules/**",
    }),
    typescript({
      tsconfig: "./tsconfig.build.json",
      useTsconfigDeclarationDir: true,
    }),
    terser(), // Minify the output (optional)
  ],
  external: [], // Add external dependencies here if needed
};
