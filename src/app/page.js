'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Home() {
	const [code, setCode] = useState(Array(6).fill(''));
	const router = useRouter();

	useEffect(() => {
		const savedCode = Cookies.get('userCode');
		if (savedCode) {
			router.push(`/${savedCode}`);
		}
	}, [router]);


	const handleChange = (index, value) => {
		let newCode = [...code];

		// If the field is empty or the cursor is at the start, replace the current digit
		if (code[index] === '' || value.length === 1) {
			newCode[index] = value;
		} else {
			if (index < 5) {
				newCode[index + 1] = value.slice(-1);
				index++;
			}
		}

		setCode(newCode);

		// Focus the next field
		const nextInput = document.getElementById(`input-${index + 1}`);
		if (nextInput) {
			nextInput.focus();
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === 'Backspace') {
			if (code[index] === '' && index > 0) {
				e.preventDefault();
				let newCode = [...code];
				newCode[index - 1] = '';
				setCode(newCode);
				const prevInput = document.getElementById(`input-${index - 1}`);
				prevInput && prevInput.focus();
			} else if (code[index]) {
				let newCode = [...code];
				newCode[index] = '';
				setCode(newCode);
			}
		}
	};


	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
		  const response = await fetch('/api/validateCode', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code }),
		  });
	  
		  const result = await response.json();
		  if (result.isValid) {
			Cookies.set('userCode', code.join(""), { expires: 7 });
			router.push(`/${code.join("")}`);
		  } else {
			alert('Invalid code. Please try again.');
		  }
		} catch (error) {
		  console.error('Error:', error);
		  // Handle the error appropriately
		}
	  };
	  

	  return (
		<main className={styles.main}>
		  <div className={styles.cont}>
			<div className={styles.hmm}></div>
			<div className={styles.title}>
				Enter Your Code
			</div>
		  </div>
		 <div className={styles.hmm}>
		  <form onSubmit={handleSubmit} className={styles.form}>
			{code.map((digit, index) => (
			  <input
				key={index}
				id={`input-${index}`}
				className={styles.inputField} // Use the class from module CSS
				type="number"
				maxLength="1"
				onKeyDown={(e) => handleKeyDown(e, index)}
				value={digit}
				onChange={(e) => handleChange(index, e.target.value)}
			  />
			))}
			<button type="submit" className={styles.submitButton}>Submit</button>
		  </form>
		  </div>
		</main>
	  );
}
