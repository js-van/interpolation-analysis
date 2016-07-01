var _table,_max,_min,_maxy,_miny;
var times=new Array();
function getAverage(){
	var avg=0;
	for(var i=1;i<times.length;i++){
		avg+=times[i];
	}
	avg/=times.length;
	console.log('Average time='+avg);
}
function generate()
{
	var x=document.getElementById('data-x').value;
	var y=document.getElementById('data-y').value;
	var data=process(x,y);
	var t0 = performance.now();
	_table=gen_divdiff(data);
	var t1 = performance.now();
	console.log(t1-t0);
	times.push(t1-t0);
	_table=gen_divdiff(data);
	var polynomial=gen_poly(_table);
	document.getElementById('answer').innerHTML=polynomial;
}
function eval()
{
	var x=document.getElementById('x').value;
	document.getElementById('evaluated').innerHTML=evaluate(_table,x);
}

//generates divided difference table
function gen_divdiff(x)
{
	var div_diff_table=new Array();
	div_diff_table[0]=new Array();
	div_diff_table[1]=new Array();

	for(var i=0,n=x[0].length;i<n;i++)
	{
		div_diff_table[0].push(x[0][i]);
		div_diff_table[1].push(x[1][i]);
	}
	for(i=2;i<n+1;i++)
	{
		div_diff_table[i]=new Array();
		for(var j=0;j<div_diff_table[i-1].length-1;j++)
		{
			div_diff_table[i].push((div_diff_table[i-1][j+1]-div_diff_table[i-1][j])/(div_diff_table[0][j+1+i-2]-div_diff_table[0][j]));
		}
	}
	return div_diff_table;
}

//this generates the polynomial
function gen_poly(tab)
{
	var poly='';
	for(var i=1; i<tab.length;i++)
	{
		if(tab[i][0]!=0)
		{
			if(poly!='')
			{
				poly+='+';
			}
			poly+='('+tab[i][0]+')';
			for(var j=0;j<i-1;j++)
			{
				if(tab[0][j]<0)
				{
					poly+='(x+'+(-1*tab[0][j])+')';
				}
				else if(tab[0][j]>0)
				{
					poly+='(x-'+tab[0][j]+')';
				}
				else
				{
					poly+='x';
				}

			}
		}
	}
	return poly;
}
function _e(x)
{
	var val=0;
	for(var i=1; i<_table.length;i++)
	{
		var term=1;
		if(_table[i][0]!=0)
		{
			term*=_table[i][0];
			for(var j=0;j<i-1;j++)
			{
				term*=(x-_table[0][j]);
			}
		}
		else
			term=0;
		val+=term;
	}
	return val;
}
function evaluate(tab,x)
{
	//tab[i][0] contains f[x0,...,xi]
	//tab[0][j] contains xj
	var val=0;
	for(var i=1; i<tab.length;i++)
	{
		var term=1;
		if(tab[i][0]!=0)
		{
			term*=tab[i][0];
			for(var j=0;j<i-1;j++)
			{
				term*=(x-tab[0][j]);
			}
		}
		else
			term=0;
		val+=term;
	}
	return val;
}
//process data from textarea into an array
function process(x,y)
{
	var xvals=x.split(',');
	var yvals=y.split(',');
	if(xvals.length!=yvals.length)
	{
		return 'err';
	}
	else
	{
		var data=new Array();
		data[0]=new Array();
		data[1]=new Array();
		_max=xvals[0];
		_min=_max;
		for(var i=0, n=xvals.length;i<n;i++)
		{
			data[0].push(xvals[i]);
			if(xvals[i]>_max)_max=xvals[i];
			else if(xvals[i]<_min)_min=xvals[i];
			data[1].push(yvals[i]);
		}
		return data;
	}
}
