use pyo3::prelude::*;
use pyo3::types::PyModule;

fn main() -> PyResult<()> {
    // Python GIL (Global Interpreter Lock) を取得し、PythonのコードをRustから実行します。
    Python::with_gil(|py| {
        // SymPyモジュールをインポート
        let sympy = PyModule::import(py, "sympy")?;

        // SymPyでSymbolオブジェクトを生成
        let symbol = sympy.getattr("Symbol")?;
        let x = symbol.call1(("x",))?;
        let y = symbol.call1(("y",))?;

        // 数式 x + 2 * y を生成
        let two = py.eval("2", None, None)?;
        let y_mul_two = y.call_method1("__mul__", (two,))?;
        let expr = x.call_method1("__add__", (y_mul_two,))?;

        println!("21:00 Result: {}", expr);
        Ok(())
    })
}
