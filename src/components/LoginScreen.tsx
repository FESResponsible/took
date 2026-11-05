'use client';

import { useState, type FormEvent } from 'react';
import { SAMPLE_ACCOUNTS } from '@/data/accounts';
import { useSupplier } from '@/state/SupplierProvider';

export function LoginScreen() {
  const { login } = useSupplier();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = login(id, password);
    if (!ok) setError('아이디 또는 비밀번호가 맞지 않아요.');
  };

  return (
    <div className="login-screen">
      <section className="login-card">
        <img className="brand-logo" src="/took-logo.png" alt="took" />
        <h1>공급사 로그인</h1>
        <p>예시 로그인입니다. 비밀번호는 이 브라우저에서만 확인하고, 금액과 메모는 이 기기에만 남아요.</p>
        <form className="login-form" onSubmit={onSubmit}>
          <label htmlFor="login-id">아이디</label>
          <input id="login-id" autoComplete="username" value={id} onChange={(event) => setId(event.target.value)} />
          <label htmlFor="login-password">비밀번호</label>
          <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error ? (
            <p className="login-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn">
            들어가기
          </button>
        </form>
        <div className="account-box">
          <h2>
            예시 계정 <span className="pill pill-wait">예시</span>
          </h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>매장</th>
                <th>아이디</th>
                <th>비밀번호</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ACCOUNTS.map((account) => (
                <tr key={account.id}>
                  <td>{account.storeName}</td>
                  <td className="nums">{account.id}</td>
                  <td className="nums">{account.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
