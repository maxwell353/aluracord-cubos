import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import ContentLoader from 'react-content-loader';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyNjE0NiwiZXhwIjoxOTU4OTAyMTQ2fQ.eX-VwNOnIh5rV0e2LRNEZlMg3wmBqOp7ftLR2exLG80';
const SUPABASE_URL = 'https://yclcqqfmovefywfmxztl.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutarMensagemTempoReal(adicionaMensagem){
    return supabaseClient
      .from('mensagens')
      .on('*', (resposta) => adicionaMensagem(resposta))
      .subscribe();
  }

export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const roteamento = useRouter();
    const username = roteamento.query.user;

    React.useEffect(() => {
        supabaseClient
        .from('mensagens')
        .select('*')
        .order('id', { ascending: false })
        .then(({ data }) => {
            setListaDeMensagens(data);
        });

        escutarMensagemTempoReal((novaMensagem) => {
            if(novaMensagem.eventType === 'INSERT'){
                setListaDeMensagens((valorAtualDaLista) => {
                    return [
                        novaMensagem.new,
                        ...valorAtualDaLista,
                    ]
                });
            }
      
            if(novaMensagem.eventType === 'DELETE'){
                setListaDeMensagens((valorAtualDaLista) => {
                const lista = valorAtualDaLista
                  .filter((mensagem) => { 
                    if (mensagem.id != novaMensagem.old.id) return mensagem 
                  });
                return [...lista];
              });
            }
        });

      }, []);

    /*
    // Usuário
    - Usuário digita no campo textarea
    - Aperta enter para enviar
    - Tem que adicionar o texto na listagem
    
    // Dev
    - [X] Campo criado
    - [X] Vamos usar o onChange usa o useState (ter if pra caso seja enter pra limpar a variavel)
    - [X] Lista de mensagens 
    */
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            // id: listaDeMensagens.length + 1,
            de: username,
            texto: novaMensagem,
        };

        supabaseClient
        .from('mensagens')
        .insert([
            // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
            mensagem
        ])
        .then(({ data }) => data);
        setMensagem('');
    }

    function handleDeletarMensagem(event) {
        const id = Number(event.target.dataset.id)
        const listaDeMensagemFiltrada = listaDeMensagens.filter((mensagemFiltrada) => {
            return mensagemFiltrada.id != id
        });

        supabaseClient
        .from('mensagens')
        .delete()
        .match({ id: id })
        .then(({ data }) => data);

        // Setando a nova lista filtrada, com uma mensagem a menos
        setListaDeMensagens(listaDeMensagemFiltrada)
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (mensagem.length > 0){
            handleNovaMensagem(mensagem);
        }
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: 'url(img/bg.png)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: 'rgba(2,15,52, 0.9)',  
                    height: '70%',
                    maxWidth: '55%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: 'rgba(2,45,72, 0.7)',  
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    {
                        listaDeMensagens.length <= 0 ?
                        <LoadMensagens />
                        :
                        <MessageList mensagens={listaDeMensagens} delMensagem={handleDeletarMensagem} />
                    }
                    
                    {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
                    <Box
                        as="form"
                        onSubmit={handleSubmit}
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: 'rgba(2,45,72, 0.9)',
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker onStickerClick={(sticker) => handleNovaMensagem(':sticker: ' + sticker)} />
                        <Box
                        styleSheet={{
                            position: 'relative',
                        }}
                        >
                        <Button
                            styleSheet={{
                            borderRadius: '50%',
                            padding: '0 3px 0 0',
                            minWidth: '48px',
                            minHeight: '48px',
                            fontSize: '20px',
                            marginBottom: '8px',
                            marginLeft: '8px',
                            lineHeight: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(154, 165, 177, 0.2)',
                            hover: {
                                filter: 'grayscale(0)',
                            }
                            }}
                            buttonColors={{
                            contrastColor: appConfig.theme.colors.neutrals["000"],
                            mainColor: '#7289D9',
                            mainColorLight: '#4E6AD0',
                            mainColorStrong: '#4E6AD0',
                            }}
                            iconName="FaLocationArrow"
                            type='submit'
                        />
                
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    const handleDeletarMensagem = props.delMensagem;
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                            <Text
                                onClick={handleDeletarMensagem}
                                styleSheet={{
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    marginLeft: '210px',
                                    marginTop: '-15px',
                                    color: '#fff',
                                    backgroundColor: 'rgba(70,15,12, 0.9)',
                                    width: '15px',
                                    height: '15px',
                                    borderRadius: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    hover: {
                                        backgroundColor: appConfig.theme.colors.neutrals[200],
                                        boxShadow: ' 0 0 2em rgb( 22, 18, 12)',
                                    }
                                }}
                                tag="span"
                                data-id={mensagem.id}
                            >
                                X
                            </Text>
                        </Box>
                        {mensagem.texto && (
                            mensagem.texto.startsWith(':sticker:')
                            ? (
                                <Image 
                                src={mensagem.texto.replace(':sticker:', '')} 
                                styleSheet={{
                                    maxWidth: {xs: '50%', md: '25%'}
                                }}
                                />
                            )
                            : mensagem.texto
                        )}
                            
                    </Text>
                );
            })}
        </Box>
    )
}

function LoadMensagens(props) {
    return (
        <ContentLoader
            height={1200}
            width={1060}
            speed={1}
            backgroundColor={'#444'}
            foregroundColor={'#999'}
            {...props}
        >
            <rect x="103" y="12" rx="3" ry="3" width="123" height="7" />
            <rect x="102" y="152" rx="3" ry="3" width="171" height="6" />
            <circle cx="44" cy="42" r="38" />
            <circle cx="44" cy="147" r="38" />
            <circle cx="44" cy="251" r="38" />
            <rect x="105" y="117" rx="3" ry="3" width="123" height="7" />
            <rect x="104" y="222" rx="3" ry="3" width="123" height="7" />
            <rect x="105" y="48" rx="3" ry="3" width="171" height="6" />
            <rect x="104" y="257" rx="3" ry="3" width="171" height="6" />
        </ContentLoader>
    )
}