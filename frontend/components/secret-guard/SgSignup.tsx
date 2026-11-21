"use client";

import { useId, useRef, type FormEvent } from "react";
import { useT } from "@/lib/i18n";
import { SIGNUP_URL, signupUrl } from "@/lib/sites";
import { SECRET_GUARD_COPY } from "./secret-guard-copy";

/**
 * L'inscription en un geste : l'adresse saisie part dans le fragment de l'adresse
 * d'inscription (`#email=`), que seule la page de plateforme.xsom.fr lit, dans le
 * navigateur. Le site ne crée aucun compte et n'envoie l'adresse nulle part.
 *
 * Le champ n'a pas de `name` : sans JavaScript, le formulaire mène à la page
 * d'inscription nue, sans jamais mettre l'adresse dans une requête.
 */
export function SgSignup() {
  const { lang } = useT();
  const copy = SECRET_GUARD_COPY[lang].hero.form;
  const id = useId();
  const field = useRef<HTMLInputElement>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.assign(signupUrl(field.current?.value ?? ""));
  };

  return (
    <div className="sg-signup">
      <form className="sg-signup__form" action={SIGNUP_URL} method="get" onSubmit={submit}>
        <label className="sg-signup__label" htmlFor={`${id}-email`}>{copy.label}</label>
        <div className="sg-signup__row">
          <input
            ref={field}
            id={`${id}-email`}
            className="sg-signup__input"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={copy.placeholder}
            required
          />
          <button type="submit" className="guard-button sg-signup__submit">{copy.submit}</button>
        </div>
      </form>
      <p className="sg-signup__alt">
        <a href={SIGNUP_URL}>{copy.github} <span aria-hidden="true">→</span></a>
      </p>
      <p className="sg-signup__note">{copy.note}</p>
    </div>
  );
}
