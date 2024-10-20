use pyo3::prelude::*;
use pyo3::types::{PyModule, PyTuple};

fn main() -> PyResult<()> {
	// Python GIL (Global Interpreter Lock) を取得し、PythonのコードをRustから実行します。
	Python::with_gil(|py| {
		// SymPyのcombinatoricsモジュールをインポート
		let sympy_combinatorics = PyModule::import(py, "sympy.combinatorics")?;
		let permutation = sympy_combinatorics.getattr("Permutation")?;
		let symmetric_group = sympy_combinatorics.getattr("SymmetricGroup")?;

		// Symmetric Group S54を作成し、Rubik's Cube用の操作を定義
		let s54 = symmetric_group.call1((54,))?;
		println!("Symmetric Group S54: {}", s54);

		// 初期状態のキューブを定義
		let initial_permutation = permutation.call1((vec![
			0, 1, 2, 3, 4, 5, 6, 7, 8,  // Front face
			9, 10, 11, 12, 13, 14, 15, 16, 17, // Other parts unaffected
			18, 19, 20, 21, 22, 23, 24, 25, 26,
			27, 28, 29, 30, 31, 32, 33, 34, 35,
			36, 37, 38, 39, 40, 41, 42, 43, 44,
			45, 46, 47, 48, 49, 50, 51, 52, 53
		],))?;
		println!("\nInitial cube state:");
		print_cube_state(py, &initial_permutation)?;

		// 置換を使用してFront (F) faceの回転を定義
		let front_face_indices = vec![6, 3, 0, 7, 4, 1, 8, 5, 2];
		let side_pieces = vec![9, 47, 35, 42, 12, 46, 31, 43, 15, 45, 29, 44];

		// `front_face_indices` と `side_pieces` を結合
		let mut combined_indices = front_face_indices;
		combined_indices.extend(side_pieces);

		// `f_rotation`の定義
		let f_rotation = permutation.call1((combined_indices,))?;
		println!("F Rotation: {}", f_rotation);

		// F回転を0回、1回、2回、3回、4回適用してそれぞれの状態を表示
		let mut current_permutation = initial_permutation;
		println!("\nF Rotation applied 0 times:");
		print_cube_state(py, &current_permutation)?;
		for i in 1..=4 {
			println!("\nF Rotation applied {} times:", i);
			current_permutation = current_permutation.call_method1("__mul__", PyTuple::new(py, &[&f_rotation]))?;
			print_cube_state(py, &current_permutation)?;
		}

		Ok(())
	})
}

// Rust側でキューブの状態を更新するのではなく、SymPyの置換オブジェクトで管理する
// SymPyの置換を使って、キューブの状態を視覚化できるようにする
// 展開図を表示する関数 (Python内で定義された置換を基に状態を取得)
fn print_cube_state(_py: Python, permutation: &PyAny) -> PyResult<()> {
	let positions: Vec<i32> = (0..54).collect();
	let permuted_positions = permutation.call1((positions,))?.extract::<Vec<i32>>()?;

	println!("\n展開図:");
	println!("    {} {} {}", permuted_positions[36], permuted_positions[37], permuted_positions[38]);
	println!("    {} {} {}", permuted_positions[39], permuted_positions[40], permuted_positions[41]);
	println!("    {} {} {}", permuted_positions[42], permuted_positions[43], permuted_positions[44]);
	println!("{} {} {}  {} {} {}  {} {} {}  {} {} {}", 
		permuted_positions[27], permuted_positions[28], permuted_positions[29], 
		permuted_positions[0], permuted_positions[1], permuted_positions[2],
		permuted_positions[9], permuted_positions[10], permuted_positions[11],
		permuted_positions[18], permuted_positions[19], permuted_positions[20]);
	println!("{} {} {}  {} {} {}  {} {} {}  {} {} {}", 
		permuted_positions[30], permuted_positions[31], permuted_positions[32], 
		permuted_positions[3], permuted_positions[4], permuted_positions[5],
		permuted_positions[12], permuted_positions[13], permuted_positions[14],
		permuted_positions[21], permuted_positions[22], permuted_positions[23]);
	println!("{} {} {}  {} {} {}  {} {} {}  {} {} {}", 
		permuted_positions[33], permuted_positions[34], permuted_positions[35], 
		permuted_positions[6], permuted_positions[7], permuted_positions[8],
		permuted_positions[15], permuted_positions[16], permuted_positions[17],
		permuted_positions[24], permuted_positions[25], permuted_positions[26]);
	println!("    {} {} {}", permuted_positions[45], permuted_positions[46], permuted_positions[47]);
	println!("    {} {} {}", permuted_positions[48], permuted_positions[49], permuted_positions[50]);
	println!("    {} {} {}", permuted_positions[51], permuted_positions[52], permuted_positions[53]);

	Ok(())
}
