$if(citations)$
$if(bibliographystyle)$

#set bibliography(style: "$bibliographystyle$")
$endif$
$if(bibliography)$
#v(-1em)
#bibliography($for(bibliography)$"$bibliography$"$sep$, $endfor$, title: none)
$endif$
$endif$
