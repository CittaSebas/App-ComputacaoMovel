import * as React from 'react';
import { Vibration, Image, TextInput, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Paragraph, Title } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class Principal extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      usuario: "Nome do Usuário",
      senha: undefined,
      xp: 0,
      nivel: 1, 
    };
  }

  goToMissoes() {
    this.props.navigation.navigate("Missões", {
      usuario: this.state.usuario,
      xp: this.state.xp,
      nivel: this.state.nivel,
      atualizarXP: this.atualizarXP.bind(this),
    });
  }

  goToCadastra(){
    this.props.navigation.navigate("Criar Usuário");
  }

  async ler(){
    try{
      let senha = await AsyncStorage.getItem(this.state.usuario);
      if(senha != null){
        if(senha == this.state.senha){
          alert("Logado!!!");
          this.goToMissoes();
        }else{
          alert("Senha Incorreta!");
        }
      }else{
        alert("Usuário não foi encontrado!");
      }
    }catch(erro){
      console.log(erro);
    }
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
        <Text style={styles.texto}>{"Usuário:"}</Text>
        <TextInput
          style={styles.entrada}
          onChangeText={(texto) => this.setState({ usuario: texto })}
        />
        <Text style={styles.texto}>{"Senha:"}</Text>
        <TextInput
          style={styles.entrada}
          secureTextEntry={true}
          onChangeText={(texto) => this.setState({ senha: texto })}
        />
        <View style={styles.botoes}>
          <Button title="Entrar" onPress={() => this.ler()} />
          <Button title="Criar Conta" onPress={() => this.goToCadastra()} />
        </View>
      </View>
    );
  }
}

class Cadastro extends React.Component{
  constructor(props){
    super(props);
    this.state={
      user: undefined,
      password: undefined,
    }
  }

  async gravar(){
    try{
      await AsyncStorage.setItem(this.state.user, this.state.password);
      alert("Salvo com sucesso!!!")
      this.props.navigation.navigate("Login");
    }catch(erro){
      alert("Erro!")
    }
  }

  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.texto}>{"Cadastrar Usuário:"}</Text>
        <TextInput
          style={styles.entrada}
          onChangeText={(texto) => this.setState({ user: texto })}
        />
        <Text style={styles.texto}>{"Cadastrar Senha:"}</Text>
        <TextInput
          style={styles.entrada}
          secureTextEntry={true}
          onChangeText={(texto) => this.setState({ password: texto })}
        />
        <View style={styles.botaocadastra}>
          <Button title="Cadastrar" onPress={() => this.gravar()} />
        </View>
      </View>
    )
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 15,
                padding: 10,
                backgroundColor: '#f0f0f0',
                borderRadius: 5,
              }}
            >
            
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: this.state.completadas.includes(item.id)
                    ? 'green'
                    : 'gray',
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
        const cooldown = 1 * 1 * 5 * 1000;
        if (tempoPassado < cooldown) {
          this.setState({ cooldownAtivo: true });
        }
      }
    } catch (erro) {
      console.log(erro);
    }
  };

  marcarComoCompleta = (id, xpGanho) => {
    if (this.state.cooldownAtivo) {
      alert('Missão diária em cooldown. Tente novamente após 24 horas.');
      return;
    }
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 15,
                padding: 10,
                backgroundColor: '#f0f0f0',
                borderRadius: 5,
              }}
            >
            
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: this.state.completadas.includes(item.id)
                    ? 'green'
                    : 'gray',
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

class Perfil extends React.Component{
  render(){
    const { usuario, xp, nivel } = this.props.route.params;
    return(
      <View>
        <Image
          source={require('./assets/PerfilApp.jpg')} 
          style={styles.fotoperfil} 
          />
        <Text style={ { fontSize: 24, fontWeight: 'bold' }}>{"Bem vindo " + usuario}</Text>
        <Text>{"Experiência: " + xp}</Text>
        <Text>{"Nível: " + nivel}</Text>
      </View>
    )
  }
}


class App extends React.Component {
  render() {
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={PrincipalStack} options={{ headerShown: false }} />
          <Stack.Screen name="Criar Usuário" component={Cadastro} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}


function PrincipalStack() {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Principal}/>
      <Stack.Screen
        name="Missões"
        component={TabMissoes}
      />
    </Stack.Navigator>
  )
}

function TabMissoes({ route }){
  const { usuario, xp, nivel, atualizarXP } = route.params;
  return(
      <Tab.Navigator  screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Missões') {
                iconName = 'walk';
              } else if (route.name === 'Perfil') {
                iconName = 'account';
              } else if(route.name === 'Diarias'){
                iconName = 'run'
              }

              return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
            },
          })}
          >
        <Tab.Screen name="Missões" component={Missoes} initialParams={{ usuario, xp, nivel, atualizarXP }} />
        <Tab.Screen name="Diarias" component={MissoesDiarias} initialParams={{ usuario, xp, nivel, atualizarXP }} />
      <Tab.Screen name="Perfil" component={Perfil} initialParams={{ usuario, xp, nivel }} />
      </Tab.Navigator>
  )
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white-grey',
  },

  logo: {
    
    width: 200, 
    height: 200,
    marginBottom: 20,
    borderRadius: 100, 
  },
  fotomissoes:{
    alignSelf: 'center',
    width: 100, 
    height: 100,
    marginBottom: 20,
    borderRadius: 50, 
  },
  fotoperfil:{
    flex: 1
  },

  texto: {
    fontSize: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  entrada: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
    width: '100%',
  },
  botaocadastra:{
    padding: 30,
    width: '100%',
  }
};

export default App;