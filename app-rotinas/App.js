import * as React from 'react';
import { TextInput, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
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

  render(){
    return(
      <View>
        <Text>{"Usuário:"}</Text>
        <TextInput onChangeText={(texto)=>this.setState({usuario: texto})} />
        <Text>{"Senha:"}</Text>
        <TextInput
          secureTextEntry={true}
          onChangeText={(texto) => this.setState({ senha: texto })}
        />
        <Button title="Entrar" onPress={()=>this.ler()} />
        <Button title="Criar Conta" onPress={()=>this.goToCadastra()} />
      </View>
    )
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
      <View>
        <Text>{"Cadastrar Usuário:"}</Text>
        <TextInput onChangeText={(texto)=>this.setState({user: texto})} />
        <Text>{"Cadastrar Senha:"}</Text>
        <TextInput
          secureTextEntry={true} 
          onChangeText={(texto) => this.setState({ password: texto })}
        />
        <Button title="Cadastrar" onPress={()=>this.gravar()} />
      </View>
    )
  }
}

class Missoes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      missoes: [
        { id: '1', descricao: 'Faça 10 minutos de exercício', xp: 50 },
        { id: '2', descricao: 'Leia um capítulo de um livro', xp: 50 },
        { id: '3', descricao: 'Medite por 5 minutos', xp: 50 },
        { id: '4', descricao: 'Escreva no seu diário', xp: 50 },
        { id: '5', descricao: 'Aprenda algo novo', xp: 50 },
      ],
      completadas: [], 
      xp: this.props.route.params.xp,
      nivel: this.props.route.params.nivel,
    };
  }

  marcarComoCompleta = (id, xpGanho) => {
    if (!this.state.completadas.includes(id)) {
      this.setState((prevState) => {
        let novoXP = prevState.xp + xpGanho;
        let novoNivel = prevState.nivel;

        if (novoXP >= 200) {
          novoNivel += 1;
          novoXP = 0;
        }

        // Atualiza o estado global de XP e nível
        this.props.route.params.atualizarXP(novoXP, novoNivel);

        return {
          completadas: [...prevState.completadas, id],
          xp: novoXP,
          nivel: novoNivel,
        };
      });
    }
  };

  render() {
    
    const missoesParaMostrar = this.state.missoes.slice(0, 3);

    return (
      <View style={{ flex: 1, padding: 20 }}>
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
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{usuario}</Text>
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
                iconName = 'account-details';
              } else if (route.name === 'Perfil') {
                iconName = 'account';
              }
              return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
            },
          })}
          >
        <Tab.Screen name="Missões" component={Missoes} initialParams={{ usuario, xp, nivel, atualizarXP }} />
      <Tab.Screen name="Perfil" component={Perfil} initialParams={{ usuario, xp, nivel }} />
      </Tab.Navigator>
  )
}

export default App;
