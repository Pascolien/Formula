<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output 
        method="xml"
        encoding="ISO-8859-1"
        doctype-public="-//W3C//DTD HTML 4.01//EN"
        doctype-system="http://www.w3.org/TR/html4/strict.dtd"
        indent="yes" />
    
    <xsl:template match="xml">        
        <xsl:apply-templates select="results"/>
    </xsl:template>
    
    <xsl:template match="results">        
        <xsl:apply-templates select="Mark_Obj"/>
    </xsl:template>
    
    <xsl:template match="Mark_Obj">               
        <row  id="">
            <xsl:attribute name="id">
                <xsl:value-of select="position()-1"/>
            </xsl:attribute>
            <cell><xsl:value-of select="@sName"/>^navigation.asp?ID_Obj=<xsl:value-of select="@ID"/>^_self</cell>
            <xsl:apply-templates select="Mark" />            
        </row>
    </xsl:template>
    
    <xsl:template match="Mark">
        <cell>
            <xsl:value-of select="@sVal"/>
        </cell>
    </xsl:template>
    
</xsl:stylesheet>
