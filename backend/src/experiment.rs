use pyo3::prelude::*;
use pyo3::types::{PyModule, IntoPyDict};

fn main() -> PyResult<()> {
	// Python GIL (Global Interpreter Lock) を取得し、PythonのコードをRustから実行します。
	Python::with_gil(|py| {
		// SymPyのcombinatoricsモジュールをインポート
		let sympy_combinatorics = PyModule::import(py, "sympy.combinatorics")?;
		let permutation = sympy_combinatorics.getattr("Permutation")?;

		// ルービックキューブの各面の色配置を(1~6)の数値に割り当てる
		// 各面は 6x9 = 54 の要素を持つので、54個の位置を表現する
		// F, B, R, L, U, D の各回転操作を定義

		// Front (F) face 90度時計回りの置換
		let f_rotation = permutation.call1((
			vec![
				6, 3, 0, 7, 4, 1, 8, 5, 2,  // Front face rotation (3x3 grid)
				9, 10, 11, 12, 13, 14, 15, 16, 17, // Other parts unaffected
				18, 19, 20, 21, 22, 23, 24, 25, 26,
				27, 28, 29, 30, 31, 32, 33, 34, 35,
				36, 37, 38, 39, 40, 41, 42, 43, 44,
				45, 46, 47, 48, 49, 50, 51, 52, 53
			],
		))?;
		println!("F Rotation: {}", f_rotation);

		// 同じF回転を4回行って元に戻るか確認
		let f_rotation_4 = py.eval("f_rotation * f_rotation * f_rotation * f_rotation", None, Some(
			[("f_rotation", f_rotation)].into_py_dict(py)))?;
		println!("F Rotation applied 4 times: {}", f_rotation_4);

		// 他の回転操作 (B, R, L, U, D) も同様に定義できます。
		// 例として、Back (B) face 90度時計回りの置換を定義
		let b_rotation = permutation.call1((
			vec![
				0, 1, 2, 3, 4, 5, 6, 7, 8,  // Unaffected
				15, 12, 9, 16, 13, 10, 17, 14, 11,  // Back face rotation (3x3 grid)
				18, 19, 20, 21, 22, 23, 24, 25, 26,
				27, 28, 29, 30, 31, 32, 33, 34, 35,
				36, 37, 38, 39, 40, 41, 42, 43, 44,
				45, 46, 47, 48, 49, 50, 51, 52, 53
			],
		))?;
		println!("B Rotation: {}", b_rotation);

		// 同じB回転を4回行って元に戻るか確認
		let b_rotation_4 = py.eval("b_rotation * b_rotation * b_rotation * b_rotation", None, Some(
			[("b_rotation", b_rotation)].into_py_dict(py)))?;
		println!("B Rotation applied 4 times: {}", b_rotation_4);

		Ok(())
	})
}
