use pyo3::prelude::*;
use pyo3::types::PyModule;

fn main() -> PyResult<()> {
    // Python GIL (Global Interpreter Lock) を取得し、PythonのコードをRustから実行します。
    Python::with_gil(|py| {
        // SymPyのcombinatoricsモジュールをインポート
        let sympy_combinatorics = PyModule::import(py, "sympy.combinatorics")?;
        let permutation = sympy_combinatorics.getattr("Permutation")?;
        let symmetric_group = sympy_combinatorics.getattr("SymmetricGroup")?;

        // 置換 (0, 1, 2) を生成
        let p = permutation.call1((vec![1, 2, 0],))?;
        println!("Permutation: {}", p);

        // 3次対称群を生成
        let s3 = symmetric_group.call1((3,))?;
        println!("Symmetric Group S3: {}", s3);

        // 生成された群の位数を取得
        let order = s3.getattr("order")?.call0()?;
        println!("Order of S3: {}", order);

        Ok(())
    })
}
