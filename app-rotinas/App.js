import * as React from 'react';
import { Vibration, Image, TextInput, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

class Principal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xp: 0,
      nivel: 1, 
    };
  }

  

  goToMissoes() {
    this.props.navigation.navigate("Missoes", {
      xp: this.state.xp,
      nivel: this.state.nivel,
      atualizarXP: this.atualizarXP.bind(this),
    });
  }

  goToMissoesDiarias() {
    this.props.navigation.navigate("MissoesDiarias", {
      xp: this.state.xp,
      nivel: this.state.nivel,
      atualizarXP: this.atualizarXP.bind(this),
    });
  }

  goToPerfil() {
    this.props.navigation.navigate("Perfil", {
      xp: this.state.xp,
      nivel: this.state.nivel,
    });
  }

  goToSobre() {
    this.props.navigation.navigate("Sobre");
  }

  atualizarXP(xp, nivel) {
    this.setState({ xp, nivel });
  }

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
            <Text style={styles.botaoTexto}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botao} onPress={() => this.goToSobre()}>
            <Text style={styles.botaoTexto}>Sobre</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class Missoes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      missoes: [
        { id: '1', descricao: 'Faça 10 minutos de exercício', xp: 10 },
        { id: '2', descricao: 'Leia um capítulo de um livro', xp: 10 },
        { id: '3', descricao: 'Medite por 5 minutos', xp: 10 },
        { id: '4', descricao: 'Escreva no seu diário', xp: 10 },
        { id: '5', descricao: 'Aprenda algo novo', xp: 10 },
        { id: '6', descricao: 'Faça sua cama', xp: 10 },
        { id: '7', descricao: 'Mande mensagem para algum amigo', xp: 10 },
        { id: '8', descricao: 'Tome banho', xp: 10 },
      ],
      completadas: [],
      xp: this.props.route.params.xp,
      nivel: this.props.route.params.nivel,
    };
  }

  componentDidMount() {
    this.embaralharMissoes();
  }

  embaralharMissoes = () => {
    const missoesEmbaralhadas = [...this.state.missoes].sort(() => 0.5 - Math.random());
    this.setState({ missoes: missoesEmbaralhadas.slice(0, 5) });
  };

  marcarComoCompleta = (id, xpGanho) => {
    if (!this.state.completadas.includes(id)) {
      this.setState((prevState) => {
        let novoXP = prevState.xp + xpGanho;
        let novoNivel = prevState.nivel;

        if (novoXP >= 200) {
          novoNivel += 1;
          novoXP = 0;
        }

        this.props.route.params.atualizarXP(novoXP, novoNivel);
        Vibration.vibrate(500);

        return {
          completadas: [...prevState.completadas, id],
          xp: novoXP,
          nivel: novoNivel,
        };
      });
    }
  };

  render() {
    const missoesParaMostrar = this.state.missoes.slice(0, 5);

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

class MissoesDiarias extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      missoes: [
        { id: '1', descricao: '150xp', xp: 150 },
        { id: '2', descricao: '140xp', xp: 140 },
        { id: '3', descricao: '110xp', xp: 110 },
        { id: '4', descricao: '100xp', xp: 100 },
        { id: '5', descricao: '120xp', xp: 120 },
        { id: '6', descricao: '130xp', xp: 130 },
      ],
      completadas: [],
      xp: this.props.route.params.xp,
      nivel: this.props.route.params.nivel,
      cooldownAtivo: false,
      tempoRestante: null,
    };
  }

  componentDidMount() {
    this.embaralharMissoes();
    this.checkCooldown();
  }

  embaralharMissoes = () => {
    const missoesEmbaralhadas = [...this.state.missoes].sort(() => 0.5 - Math.random());
    this.setState({ missoes: missoesEmbaralhadas.slice(0, 3) });
  };

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
        }
      }
    } catch (erro) {
      console.log(erro);
    }
  };

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

        this.props.route.params.atualizarXP(novoXP, novoNivel);
        Vibration.vibrate(500);

        AsyncStorage.setItem('ultimoLogin', Date.now().toString());

        return {
          completadas: [...prevState.completadas, id],
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

class Perfil extends React.Component {
  render() {
    const { xp, nivel } = this.props.route.params;

    return (
      <View>
        <Text style={styles.tituloPerfil}>  XP: {xp}   |   Nível: {nivel}</Text>
      </View>
    );
  }
}

class Sobre extends React.Component {
  render() {
    return (
      <View>
        <Image
          source={require('./assets/PerfilApp.jpeg')} 
          style={styles.fotomissoes} 
        />
        <Text style={styles.titulo}>  Projeto de Computação Movél</Text>
        <Text>  Feito por : Sebastian Citta</Text>
        <Text style={styles.subtitulo}>  Mudanças para o Futuro:</Text>
        <Text>  - Adição de Contas</Text>
        <Text>  - Sistema de Níveis mais avançado</Text>
        <Text>  - Melhora Visual</Text>
        <Text>  - Melhora na Lógica</Text>
      </View>
    );
  }
}

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
    backgroundColor: '#77C3EC', // cor parecida ao baby blue q achei no google
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
