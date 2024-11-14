// importacoes
import * as React from 'react';
import { Vibration, Image, TextInput, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

// tela principal do aplicativo
class Principal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xp: 0,    // Estado inicial de XP
      nivel: 1, // Estado inicial de nivel
    };
  }

  // ao montar chama funcao de carregar os dados
  async componentDidMount() {
    await this.carregarDados();
  }

  // funcao que carrega os dados xp e nivel do asyncstorage
  async carregarDados() {
    try {
      const xp = await AsyncStorage.getItem('xp');
      const nivel = await AsyncStorage.getItem('nivel');
      if (xp !== null && nivel !== null) {
        this.setState({ xp: parseInt(xp), nivel: parseInt(nivel) });
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  }
  
  // funcao que salva os dados no asyncstorage
  async salvarDados(xp, nivel) {
    try {
      await AsyncStorage.setItem('xp', xp.toString());
      await AsyncStorage.setItem('nivel', nivel.toString());
    } catch (error) {
      console.log('Erro ao salvar dados:', error);
    }
  }

  // funcao chamada ao completar missao que guarda o xp atualizado
  atualizarXP(xp, nivel) {
    this.setState({ xp, nivel }, () => {
      this.salvarDados(xp, nivel);
    });
  }

  // para navegar para a tela de missoes
  goToMissoes() {
    this.props.navigation.navigate("Missoes", {
      xp: this.state.xp,
      nivel: this.state.nivel,
      atualizarXP: this.atualizarXP.bind(this),
    });
  }

  // para navegar para a tela de diarias
  goToMissoesDiarias() {
    this.props.navigation.navigate("MissoesDiarias", {
      xp: this.state.xp,
      nivel: this.state.nivel,
      atualizarXP: this.atualizarXP.bind(this),
    });
  }

  // para navegar para a tela de perfil
  goToPerfil() {
    this.props.navigation.navigate("Perfil", {
      xp: this.state.xp,
      nivel: this.state.nivel,
    });
  }

  // botoes para ir para as outras telas
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('./assets/LogoApp.jpeg')} 
          style={styles.logo} 
        />
        <View style={styles.botoes}>
          <TouchableOpacity style={styles.botao} onPress={() => this.goToMissoes()}>
            <Text style={styles.botaoTexto}>Missões</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => this.goToMissoesDiarias()}>
            <Text style={styles.botaoTexto}>Diárias</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => this.goToPerfil()}>
            <Text style={styles.botaoTexto}>Área de Descanso</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    );
  }
}

// tela de missoes
class Missoes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      missoes: [ // array das missoes
        { id: '1', descricao: 'Faça 10 minutos de exercício', xp: 10 },
        { id: '2', descricao: 'Leia um capítulo de um livro', xp: 10 },
        { id: '3', descricao: 'Medite por 5 minutos', xp: 10 },
        { id: '4', descricao: 'Escreva no seu diário', xp: 10 },
        { id: '5', descricao: 'Aprenda algo novo', xp: 10 },
        { id: '6', descricao: 'Faça sua cama', xp: 10 },
        { id: '7', descricao: 'Mande mensagem para algum amigo', xp: 10 },
        { id: '8', descricao: '10xp', xp: 10 },
        { id: '9', descricao: '10xp', xp: 10 },
      ],
      completadas: [],                        // guarda as missoes ja completadas
      xp: this.props.route.params.xp,         // pega xp do usuario que foi pego na tela principal
      nivel: this.props.route.params.nivel,   // mesma coisa que o xp mas para nivel
    };
  }

  // faz com que sempre que a tela é aberta as missoes sejam embaralhadas
  componentDidMount() {
    this.embaralharMissoes();
  }

  // funcao que embaralha as missoes, para que as missões mostradas sejam diferentes
  embaralharMissoes = () => {
    const missoesEmbaralhadas = [...this.state.missoes].sort(() => 0.5 - Math.random());
    this.setState({ missoes: missoesEmbaralhadas.slice(0, 5) });
  };

  // funcao acionada ao completar missao que aumenta o xp
  marcarComoCompleta = (id, xpGanho) => {
    if (!this.state.completadas.includes(id)) {
      this.setState((prevState) => {
        let novoXP = prevState.xp + xpGanho;
        let novoNivel = prevState.nivel;

        if (novoXP >= 200) { // a cada 200 de xp usuario sobe de nivel
          novoNivel += 1;
          novoXP = novoXP - 200
        }

        this.props.route.params.atualizarXP(novoXP, novoNivel);
        Vibration.vibrate(500); // faz o celular vibrar

        return {
          completadas: [...prevState.completadas, id],
          xp: novoXP,
          nivel: novoNivel,
        };
      });
    }
  };

  render() {
    const missoesParaMostrar = this.state.missoes.slice(0, 5); // pega 5 missoes para mostrar na tela

    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Image
          source={require('./assets/MissoesApp.jpeg')} 
          style={styles.fotomissoes} 
        />
        <FlatList
          data={missoesParaMostrar}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: this.state.completadas.includes(item.id) ? 'green' : 'gray',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}
                onPress={() => this.marcarComoCompleta(item.id, parseInt(item.xp))}
              >
                <Text style={{ color: 'white' }}>✓</Text>
              </TouchableOpacity>
              <Text>{item.descricao}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

// tela de diarias
class MissoesDiarias extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      missoes: [ // array de missoes
        { id: '1', descricao: 'Tome banho', xp: 150 },
        { id: '2', descricao: 'Lave os pratos', xp: 140 },
        { id: '3', descricao: 'Limpe a Casa', xp: 110 },
        { id: '4', descricao: '100xp', xp: 100 },
        { id: '5', descricao: '120xp', xp: 120 },
        { id: '6', descricao: '130xp', xp: 130 },
      ],
      completadas: [],
      xp: this.props.route.params.xp,
      nivel: this.props.route.params.nivel,
      cooldownAtivo: false, // cooldown para que as missões so possam ser completadas 1 vez ao dia
      tempoRestante: null, 
    };
  }

  // ao montar pega as missoes concluidas como para que ja fique marcada que foi feita e verifica cooldown
  async componentDidMount() {
    await this.carregarMissoesConcluidas();
    this.checkCooldown();
  }


  async carregarMissoesConcluidas() {
    try {
      const completadas = await AsyncStorage.getItem('completadasDiarias');
      if (completadas !== null) {
        this.setState({ completadas: JSON.parse(completadas) });
      }
    } catch (error) {
      console.log('Erro ao carregar missões concluídas:', error);
    }
  }

  // funcao que embaralha missoes, mas esta pega apenas 3 missoes em vez de 5 e é chamada apenas a cada 24 horas
  embaralharMissoes = () => {
    const missoesEmbaralhadas = [...this.state.missoes].sort(() => 0.5 - Math.random());
    this.setState({ missoes: missoesEmbaralhadas.slice(0, 3) });
  };

  // verifica cooldown e da alerta na tela mostrando o tempo faltante
  checkCooldown = async () => {
  try {
    const ultimoLogin = await AsyncStorage.getItem('ultimoLogin');
    if (ultimoLogin) {
      const tempoPassado = Date.now() - parseInt(ultimoLogin);
      const cooldown = 24 * 60 * 60 * 1000;
      if (tempoPassado < cooldown) {
        const tempoRestante = cooldown - tempoPassado;
        const horasRestantes = Math.floor(tempoRestante / (1000 * 60 * 60));
        const minutosRestantes = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
        this.setState({ cooldownAtivo: true, tempoRestante: `${horasRestantes}h ${minutosRestantes}m` });
      } else {
        this.setState({ cooldownAtivo: false, completadas: [] }, () => {
          this.embaralharMissoes();
        });
      }
    }
  } catch (erro) {
    console.log(erro);
  }
};

  // mesma logica que na classe missoes
  marcarComoCompleta = (id, xpGanho) => {
    if (this.state.cooldownAtivo) {
      alert(`Missão diária em cooldown. Tente novamente após ${this.state.tempoRestante}.`);
      return;
    }
    if (!this.state.completadas.includes(id)) {
      this.setState((prevState) => {
        let novoXP = prevState.xp + xpGanho;
        let novoNivel = prevState.nivel;

        if (novoXP >= 200) {
          novoNivel += 1;
          novoXP = novoXP - 200;
        }

        const novasCompletadas = [...prevState.completadas, id];
        AsyncStorage.setItem('completadasDiarias', JSON.stringify(novasCompletadas));
        this.props.route.params.atualizarXP(novoXP, novoNivel);
        Vibration.vibrate(500);

        AsyncStorage.setItem('ultimoLogin', Date.now().toString());

        return {
          completadas: novasCompletadas,
          xp: novoXP,
          nivel: novoNivel,
          cooldownAtivo: true,
        };
      });
    }
  };

  render() {
    const missoesParaMostrar = this.state.missoes.slice(0, 3);

    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Image
          source={require('./assets/DiariasApp.jpeg')} 
          style={styles.fotomissoes} 
        />
        <FlatList
          data={missoesParaMostrar}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: this.state.completadas.includes(item.id) ? 'green' : 'gray',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}
                onPress={() => this.marcarComoCompleta(item.id, parseInt(item.xp))}
              >
                <Text style={{ color: 'white' }}>✓</Text>
              </TouchableOpacity>
              <Text>{item.descricao}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

// tela de perfil
class Perfil extends React.Component {
  goToSobre() { // para navegar para a tela sobre
    this.props.navigation.navigate("Sobre");
  }

  render() {
    const { xp, nivel } = this.props.route.params; // pega xp e nivel para imprimir na tela

    return (
      <View>
        <Image
          source={require('./assets/PerfilApp.jpeg')} // imagem
          style={styles.fotomissoes} 
        />
        <Text style={styles.tituloxp}>  XP: {xp}   |   Nível: {nivel}</Text>
        
        <TouchableOpacity style={styles.botao} onPress={() => this.goToSobre()}>
            <Text style={styles.botaoTexto}>Sobre</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// tela sobre
class Sobre extends React.Component {
  render() {
    return (
      <View>
        <Image
          source={require('./assets/SobreApp.jpeg')} 
          style={styles.fotomissoes} 
        />
        <Text style={styles.titulo}>  Projeto de Computação Movél</Text>
        <Text>  Feito por : Sebastian Citta</Text>
        <Text style={styles.subtitulo}>  Mudanças para o Futuro:</Text>
        <Text>  - Adição de Contas</Text>
        <Text>  - Sistema de Níveis mais avançado</Text>
        <Text>  - Melhora Visual</Text>
        <Text>  - Melhora na Lógica</Text>
        <Text>  - Conquistas com Medalhas desbloqueaveis</Text>
        <Text>  - Implementação de Missões Personalizáveis</Text>
      </View>
    );
  }
}

// estilos para botoes textos e mais
const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tituloPerfil: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tituloxp: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botoes: {
    width: '100%',
    padding: 10,
  },
  botao: {
    backgroundColor: '#77C3EC', // cor parecida ao baby blue que achei no google
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 20,
    alignItems: 'center',
  },
  botaoTexto: {
    color: 'Black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    width: 200, 
    height: 200,
    marginBottom: 20,
    borderRadius: 100, 
  },
  fotomissoes:{
    alignSelf: 'center',
    width: 150, 
    height: 150,
    marginBottom: 20,
    borderRadius: 75, 
  },
};


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Principal" component={Principal} />
        <Stack.Screen name="Missoes" component={Missoes} />
        <Stack.Screen name="MissoesDiarias" component={MissoesDiarias} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Sobre" component={Sobre} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
