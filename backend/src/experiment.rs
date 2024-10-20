use pyo3::prelude::*;
use pyo3::types::IntoPyDict;

fn main() -> PyResult<()> {
    // Python GIL (Global Interpreter Lock) を取得し、PythonのコードをRustから実行します。
    Python::with_gil(|py| {
        // SymPyモジュールをインポート
        let sympy = py.import("sympy")?;
        let locals = [("sympy", sympy)].into_py_dict(py);

        // SymPyを使った数式の作成と評価
        let expr = py.eval("sympy.Symbol('x') + 2 * sympy.Symbol('y')", Some(locals), None)?;
        println!("Result: {}", expr);
        Ok(())
    })
}

/*
このコードでは、RustとPythonの間でPyO3を使用してSymPyを呼び出しています。
1. `Python::with_gil` でPythonのGIL（Global Interpreter Lock）を取得し、Pythonのコードを安全に実行します。
2. `py.import("sympy")` でSymPyモジュールをインポートし、`locals` 変数に追加します。
3. `py.eval` を使ってPythonコード内でSymPyの式を評価し、その結果をRustで表示します。

この方法を使うことで、Rustのプロジェクト内でSymPyの強力な数式処理能力を利用することができます。
*/
