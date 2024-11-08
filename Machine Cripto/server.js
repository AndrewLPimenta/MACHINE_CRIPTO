


function criarConta(dadosUsuario, arquivoRG) {
  return new Promise((resolve, reject) => {
    console.log("Iniciando o processo de criação de conta...");

    if (
      !dadosUsuario.usuario ||
      !dadosUsuario.email ||
      !dadosUsuario.telefone ||
      !dadosUsuario.cpf ||
      !dadosUsuario.cep ||
      !dadosUsuario.renda ||
      !arquivoRG
    ) {
      reject(new Error("Todos os campos obrigatórios devem ser preenchidos corretamente."));
    } else {
      console.log("Campos preenchidos corretamente. Verificando informações...");

      verificarCPF(dadosUsuario.cpf)
        .then((cpfValido) => {
          if (!cpfValido) {
            throw new Error("CPF inválido ou já cadastrado.");
          }
          return verificarEmail(dadosUsuario.email);
        })
        .then((emailDisponivel) => {
          if (!emailDisponivel) {
            throw new Error("E-mail já está em uso.");
          }
          console.log("E-mail verificado. Verificando CEP...");
          return verificarCEP(dadosUsuario.cep);
        })
        .then((cepValido) => {
          if (!cepValido) {
            throw new Error("CEP inválido.");
          }
          console.log("CEP válido. Registrando a conta...");
          return registrarConta(dadosUsuario, arquivoRG);
        })
        .then((conta) => {
          console.log(`Conta registrada para ${conta.usuario}. Aprovando...`);
          return aprovarConta(conta.id).then(() => criarCartao(conta.id, dadosUsuario.tipoCartao));
        })
        .then((cartao) => {
          resolve(cartao);
        })
        .catch((erro) => {
          reject(erro);
        });
    }
  });
}

// Funções de API

function verificarCPF(cpf) {
  return fetch("https://api.exemplo.com/api/verificar-cpf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cpf }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao verificar CPF.");
      return response.json();
    })
    .then((data) => data.cpfValido);
}

function verificarEmail(email) {
  return fetch("https://api.exemplo.com/api/verificar-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao verificar e-mail.");
      return response.json();
    })
    .then((data) => data.disponivel);
}

function verificarCEP(cep) {
  return fetch(`https://api.exemplo.com/api/verificar-cep?cep=${cep}`)
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao verificar CEP.");
      return response.json();
    })
    .then((data) => data.cepValido);
}

function registrarConta(dadosUsuario, arquivoRG) {
  const formData = new FormData();
  formData.append("usuario", dadosUsuario.usuario);
  formData.append("email", dadosUsuario.email);
  formData.append("telefone", dadosUsuario.telefone);
  formData.append("cpf", dadosUsuario.cpf);
  formData.append("cep", dadosUsuario.cep);
  formData.append("renda", dadosUsuario.renda);
  formData.append("mae", dadosUsuario.mae);
  formData.append("rg", arquivoRG);

  return fetch("https://api.exemplo.com/api/registrar-conta", {
    method: "POST",
    body: formData,
  }).then((response) => {
    if (!response.ok) throw new Error("Erro ao registrar a conta.");
    return response.json();
  });
}

function aprovarConta(userId) {
  return fetch("https://api.exemplo.com/api/aprovar-conta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  }).then((response) => {
    if (!response.ok) throw new Error("Erro ao aprovar a conta.");
    return response.json();
  });
}

function criarCartao(userId, tipoCartao) {
  return fetch("https://api.exemplo.com/api/criar-cartao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, tipoCartao }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao criar o cartão.");
      return response.json();
    })
    .then((data) => {
      console.log(`Cartão ${tipoCartao} criado com sucesso.`);
      return data;
    });
}

// Manipulação do formulário
document.getElementById("formCriarConta").addEventListener("submit", function (event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const cpf = document.getElementById("cpf").value;
  const cep = document.getElementById("cep").value;
  const renda = document.getElementById("renda").value;
  const mae = document.getElementById("mae").value;
  const rg = document.getElementById("rg").files[0];
  const tipoCartao = document.getElementById("tipoCartao").value;

  const dadosUsuario = {
    usuario,
    email,
    telefone,
    cpf,
    cep,
    renda,
    mae,
    tipoCartao,
  };

  criarConta(dadosUsuario, rg)
    .then((cartao) => {
      console.log("Conta criada com sucesso!", cartao);
    })
    .catch((erro) => {
      console.error("Erro ao criar a conta:", erro);
    });
});

// Nova alteração!!!

function confirmarPedido(pedido) {
  return new Promise((resolve, reject) => {
    // Simulando um atraso de 2 segundos para processar o pedido
    setTimeout(() => {
      // Aqui você pode verificar o estado da compra
      const compraAprovada = true; // Simulando que a compra foi aprovada

      if (compraAprovada) {
        resolve(`Pedido confirmado com sucesso! Detalhes do pedido: ${JSON.stringify(pedido)}`);
      } else {
        reject(new Error('A compra não foi aprovada. Não foi possível confirmar o pedido.'));
      }
    }, 2000);
  });
}

// Exemplo de uso:
const pedido = {
  id: 123,
  produto: 'Cartão Gold',
  quantidade: 1,
  valorTotal: $04990
};

confirmarPedido(pedido)
  .then(mensagem => {
    console.log(mensagem); // Pedido confirmado com sucesso!
  })
  .catch(erro => {
    console.error(erro.message); // A compra não foi aprovada.
  });



function AnaliseDeCadastro(dadosUsuario) {
  if (dadosUsuario == null) {
    alert("Seu cadastro não foi concluido devido à falta de informações! \n Por favor, complete seu cadastro!")
  } else if (dadosUsuario === false) {
    alert("Não foi possivel completar seu cadastro! verificaremos em uma análise futura se o Sr(Sra) se encaixa em nossos termos de uso")
  } else {
    alert("Cadastro realizado com sucesso!")
  }
}


