import appConfig from '../config.json';
import { Box, Button, Text, TextField, Image } from '@skynexui/components';

function GlobalStyle() {
    return (
        <style global jsx>{`
        * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                list-style: none;
            }
            @import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+P+One&display=swap');
            body {
                font-family: 'Mochiy Pop P One', sans-serif;
            }
            /* App fit Height */ 
            html, body, #__next {
                min-height: 100vh;
                display: flex;
                flex: 1;
            }
            #__next {
                flex: 1;
            }
            #__next > * {
                flex: 1;
            }
            /* ./App fit Height */ 
            a {
                text-decoration: none;
            }
        `}</style>
    );
}

function Title(props) {
    const Tag = props.tag || 'h1';
    return (
        <>
            <Tag>{props.children}</Tag>
            <style jsx>{`
                ${Tag} {
                    color: ${appConfig.theme.colors.neutrals['000']};
                    font-size: 26px;
                    font-weight: 600;
                }
            `}</style>
        </>
    );
}


export default function PaginaInicial() {
    const username = 'Maxwell353';

    return (
        <>
            <GlobalStyle />
            {/* box */}
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundImage: 'url(img/bg.png)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                {/* box-center */}
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '800px',
                        borderRadius: '5px', padding: '52px', margin: '16px',
                        backgroundColor: 'rgba(2,15,52, 0.9)',
                    }}
                >

                    {/* formulário */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                        }}
                    >
                        <Title tag="h2">Boas vindas geral!</Title>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            fullWidth
                            textFiealdColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals[200],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.primary[500],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                }, 
                            }}
                            styleSheet={{
                                marginBottom: '10px',
                                border: '2px solid #2d2d2d',
                                focus: {
                                    boxShadow: '0 0 0 0',
                                    outline: '0',
                                },
                                hover: {
                                    border: '2px solid #2d2d2d',
                                }
                            }}
                        />
                        <Button
                            type='submit'
                            label='Entrar'
                            fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.custom.white,
                                mainColor: appConfig.theme.colors.neutrals[900],
                                mainColorLight: appConfig.theme.colors.primary[900],
                                mainColorStrong: appConfig.theme.colors.neutrals[900],
                            }}
                            styleSheet={{
                                border: '1px solid #2d2d2d',
                                hover: {
                                    backgroundColor: appConfig.theme.colors.custom.grey1,
                                }
                            }}
                        />
                    </Box>
                    {/* end formulário */}

                    {/*  Photo Area */}
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '250px',
                            padding: '16px',
                            backgroundColor: 'trasnparent',
                            flex: 1,
                            minHeight: '240px',
                        }}
                    >

                        <Image
                            styleSheet={{
                                borderRadius: '50%',
                                marginBottom: '16px',
                            }}
                            src={`https://github.com/${username}.png`}
                        />

                        <a 
                            href={`https://github.com/${username}`}
                            target={'_blank'}
                        >
                            <Text
                                variant="body4"
                                styleSheet={{
                                    color: appConfig.theme.colors.neutrals[300],
                                    backgroundColor: appConfig.theme.colors.neutrals[900],
                                    padding: '5px 15px',
                                    borderRadius: '1000px',
                                    border: '1px solid #2d2d2d',
                                    hover: {
                                        backgroundColor: appConfig.theme.colors.custom.grey1,
                                    }
                                }}
                            >
                                {username}  
                            </Text>
                        </a>

                    </Box>
                    {/*  end Photo Area */}
                </Box>
                {/* end box-center */}
            </Box>
            {/* end box */}
        </>
    );
}