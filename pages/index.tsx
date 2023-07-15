// react
import { useEffect, useState } from 'react';

// packages
import Head from 'next/head';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';

// components
import Display from '../comps/Display';
import Explainer from '../comps/Explainer';
import Footer from '../comps/Footer';
import QuestionForm from '../comps/QuestionForm';
import WebsiteForm from '../comps/WebsiteForm';

// styles
import 'react-toastify/dist/ReactToastify.min.css';

// utils
import formSchema from '../utilities/formSchema';

// types
interface FormData {
	answer: string;
	question: string;
	website: string;
}

const initialState = {
	answer: '',
	question: '',
	website: '',
};

export default function Experiment() {
	const {
		register,
		handleSubmit,
		resetField,
		formState: { errors },
	} = useForm({
		defaultValues: {
			question: initialState.question,
			website: initialState.website,
		},
		resolver: yupResolver(formSchema),
	});

	const [log, setLog] = useState([]);
	const [loading, setLoading] = useState(false);

	const onSubmit = async (formData: FormData) => {
		if (loading) return;

		setLoading(true);

		const { question, website } = formData;
    const pastLogState = [...log]

    
		setLog([...log, { question, answer: '' }]);

		try {
			const res = await fetch('/api/answer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ question, website }),
			});

			if (res.status === 404) {
				toast('Website not found');
				setLog([...pastLogState]);
				return;
			}

			const data = await res.json();

			if (data.status === 400) {
				toast('Unable to read website');
				setLog([...pastLogState]);
				return;
			}

      if(!data.text) {
        setLog([...pastLogState])
      }else {
        setLog([...log, { question, answer: data.text }]);
      }

		} catch (error) {
			console.log(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		resetField('question');
	}, [log]);

	return (
		<>
			<Head>
				<title>Chatbox</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Explainer />
			<ToastContainer position='top-center' />
			<Display 
        loading={loading} 
        log={log}
      />
      <QuestionForm 
        handleSubmit={handleSubmit} 
        register={register} 
        errors={errors} 
        onSubmit={onSubmit}
      />
      <WebsiteForm
				handleSubmit={handleSubmit}
				register={register}
				errors={errors}
				onSubmit={onSubmit}
			/>
			<Footer />
		</>
	);
}
