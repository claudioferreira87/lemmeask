import { useHistory } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';
import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export function Home() {
	const schema = Yup.object().shape({
		roomCode: Yup.string()
			.required('Codigo obrigatorio')
			.min(6, '6 caracteres no minimo'),
	});
	const history = useHistory();
	const { signInWhithGoogle, user } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const { register, handleSubmit, formState } = useForm({
		resolver: yupResolver(schema),
	});

	async function handleCreateNewRoom() {
		if (!user) {
			await signInWhithGoogle();
		}
		history.push('/rooms/new');
	}

	function changeTheme() {
		toggleTheme();
	}

	async function handleJoinRoom(data: any) {
		const roomRef = await database.ref(`rooms/${data.roomCode}`).get();

		if (!roomRef.exists()) {
			alert('Room does not exists');
			return;
		}

		if (roomRef.val().endedAt) {
			alert('Room already closed.');
			return;
		}

		history.push(`/rooms/${data.roomCode}`);
	}

	return (
		<div id="page-auth" className={theme}>
			<aside>
				<img src={illustrationImg} alt="Simbolizando perguntas e respostas" />
				<strong>Crie salas Q&amp;A ao-vivo</strong>
				<p>Tire as duvidas da sua audiencia em tempo-real</p>
			</aside>
			<main>
				<div className="main-content">
					<h1>{theme}</h1>
					<button onClick={changeTheme}>Toggle Theme</button>
					<img src={logoImg} alt="letmeask" />
					<button onClick={handleCreateNewRoom} className="create-room">
						<img src={googleIconImg} alt="Logo do Google" />
						Crie sua sala com o Google
					</button>
					<div className="separator">ou entre em uma sala</div>
					<form onSubmit={handleSubmit(handleJoinRoom)}>
						<input
							type="text"
							placeholder="Digite o codigo da sala"
							className={`${
								formState.errors.roomCode?.message !== 0 ? 'red' : ''
							}`}
							// onChange={event => setRoomCode(event.target.value)}
							// value={roomCode}
							{...register('roomCode')}
						/>
						<Button type="submit">Entrar na sala</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
