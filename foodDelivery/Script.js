let AdmArea = document.getElementById('okrug');
let District = document.getElementById('rayon');
let TypeObject = document.getElementById('type');
let finder = document.getElementById('finder');
let Discount = document.getElementById('discount');

let Choose_Rest; 

console.log(Discount);

let Res; //Наш список

function getRestaurants(){
	let obXhr = new XMLHttpRequest();
	
	obXhr.open('GET', 'http://exam-2020-1-api.std-400.ist.mospolytech.ru/api/data1');
	obXhr.send();
	
	obXhr.onreadystatechange = function(){
		if(obXhr.readyState != 4) return;

		if(obXhr.response){
			let result = JSON.parse(obXhr.response);
			console.log(result);
			
			for (let i = 0; i < result.length - 1; i++){
				for (let j = 0; j < result.length - 1; j++){
					if (result[j].rate < result[j+1].rate){
						let temp = result[j];
						result[j] = result[j+1]
						result[j+1] = temp;
					}
				}
			}
			
			result.length = 100;
			Res = result;
			console.log(result);
			
			let AllOkrugs = result.reduce(function(prev, curr){
				return [...prev, curr.admArea];
			}, [])
					
			let AllRayons = result.reduce(function(prev, curr){
				return [...prev, curr.district];
			}, [])
			
			let AllTypes = result.reduce(function(prev, curr){
				return [...prev, curr.typeObject];
			}, [])
			
			//console.log(AllOkrugs);
			//console.log(AllRayons);
			//console.log(AllTypes);
			
			let filter = function(Arr){
				let temp = {};				
				return Arr.filter(function(a){
					return a in temp ? 0 : temp[a] = 1;
				});
			};
			
			
			for (let key in filter(AllOkrugs)){
				let okrug = document.createElement('option');
				okrug.innerHTML = `
					<div>
						<h6> ${filter(AllOkrugs)[key]} </h6>
					</div>
				`
				
				AdmArea.append(okrug);
			}
			
			for (let key in filter(AllRayons)){
				let rayon = document.createElement('option');
				rayon.innerHTML = `
					<div>
						<h6> ${filter(AllRayons)[key]} </h6>
					</div>
				`
				
				District.append(rayon);
			}
			
			for (let key in filter(AllTypes)){
				let types = document.createElement('option');
				types.innerHTML = `
					<div>
						<h6> ${filter(AllTypes)[key]} </h6>
					</div>
				`
				
				TypeObject.append(types);
			}
		}
	}	
}

function Chooser(){
	//console.log(event.target.parentNode.parentNode.children[0]);
	
	let Name = event.target.parentNode.parentNode.children[0].innerText;
	let Address = event.target.parentNode.parentNode.children[2].innerText;
	let Price_Arr;
	
	for (let key in Res){
		if (Res[key].address == Address && Res[key].name == Name){
			Price_Arr = Res[key];
		}
	}
	
	console.log(Price_Arr);
	let Prices = Object.values(Price_Arr); //Преобразование из объекта в массив
	
	console.log(Prices);
	Prices.splice(0, 15);   //Оставляем только сет
	console.log(Prices);
	
	//console.log(Name);
	//console.log(Address);
	
	let obXhr = new XMLHttpRequest();
	
	obXhr.open('GET', 'RestInfo');
	obXhr.send();
	
	let MenuBlock = document.getElementById('menu');
	console.log(MenuBlock);
	
	MenuBlock.innerHTML = '';
	
	obXhr.onreadystatechange = function(){
		if(obXhr.readyState != 4) return;

		if(obXhr.response){
			let result = JSON.parse(obXhr.response);
			
			console.log(result);
	
			for (let i in result){
				let set = document.createElement('div');
				set.className = "col-sm-4 col-12"
			
				set.innerHTML = `
				
					<p> <img src = "${result[i].url}" width = "100%"> </p>
					<h5 class = "text-center text-danger"> ${result[i].name} </h5>
					<p> Краткое описание: ${result[i].description} </p>	
					<h4 class = "text-center"> ${Prices[i]} Рубля(лей) </h4>
					<p class = "text-center"> <button id = "butMin"> - </button> <input style = "width: 40px" value = "0"> <button id = "butPl"> + </button> </p>
				`
				
				MenuBlock.append(set);
			}
			
			let Buts_p = document.querySelectorAll('#butPl');
			console.log(Buts_p);
			
			for (let but of Buts_p){
				but.addEventListener('click', plus);  //+1 к заказу
			}
			
			let Buts_m = document.querySelectorAll('#butMin');    //Прописать завтра 2 кнопки(2 функции добавить)
			console.log(Buts_m); 			
			
			for (let but of Buts_m){
				but.addEventListener('click', minus);  //-1 к заказу
			}
		}
	}
}

function findRestaurants(){
    let Sel_Area = AdmArea.value;
	let Sel_Dist = District.value;
	let Sel_Type = TypeObject.value;
	let Sel_Disc = Discount.value;
	
	let Places = document.getElementById('Places');
	console.log(Places);
	
	Places.innerHTML = "";
	
	let MenuBlock = document.getElementById('menu');
	console.log(MenuBlock);
	
	MenuBlock.innerHTML = '';
	
	for (let i in Res){
		if (Res[i].admArea == Sel_Area && Res[i].district == Sel_Dist && Res[i].typeObject == Sel_Type && Res[i].socialPrivileges == Sel_Disc){
			console.log(Res[i]);
			
			let newDiv = document.createElement('div');
			newDiv.className = "row border border-primary";
			
			newDiv.innerHTML = `
				<div class = "col-3">
					<h6> ${Res[i].name} </h6>
				</div>
						
				<div class = "col-3">
					<h6> ${Res[i].typeObject} </h6>
				</div>
						
				<div class = "col-3">
					<h6> ${Res[i].address} </h6>
				</div>
						
				<div class = "col-3">
					<button id = "but" class = "form-control"> Выбрать </button>
				</div>
			`
			
			Places.append(newDiv);
		}
	}
	
	let Choose = document.querySelectorAll('#but');
	
	for (let butt of Choose){ 
		butt.addEventListener('click', Chooser);
	}
}

getRestaurants()
finder.addEventListener('click', findRestaurants);


